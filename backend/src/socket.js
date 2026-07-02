import { Server } from "socket.io";
import { app } from "./app.js";
import redis from "./redis/client.redis.js";
import http from "http";

import { createAdapter } from "@socket.io/redis-adapter";
import { publisher, subscriber } from "./redis/client.redis.js"
import { socketAuthMiddleware } from "./middlewares/socketAuth.middleware.js"

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL || "http://localhost:5173",
    credentials: true,
  }
});

io.adapter(createAdapter(publisher, subscriber))
io.use(socketAuthMiddleware)

// Helper to refresh TTL
async function refreshSocketTTL(userId, socketId) {
  await redis.set(
    `presence:user:${userId}:socket:${socketId}`,
    "online",
    "EX",
    60
  );
}

// Helper to check if user has other open tabs
async function isUserOnline(userId) {
  const keys = await redis.keys(`presence:user:${userId}:socket:*`);
  return keys.length > 0;
}

// Helper to get all online users safely (for newly connected clients)
async function getOnlineUserIds() {
  const uniqueUsers = new Set();
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(cursor,
      "MATCH",
      "presence:user:*:socket:*",
      "COUNT",
      100);

    cursor = nextCursor;

    for (const key of keys) {
      const parts = key.split(":");
      if (parts[2]) uniqueUsers.add(parts[2]);
    }
  } while (cursor !== '0');
  return Array.from(uniqueUsers);
}

// Socket connections
io.on("connection", async (socket) => {
  const userId = socket.data.user?.id

  if (userId) {
    socket.join(userId);

    // Check if this is their FIRST tab opening (were they already offline?)
    const alreadyOnline = await isUserOnline(userId);

    await refreshSocketTTL(userId, socket.id);

    // Send the full list of currently online users ONLY to this joining user
    const currentOnlineUsers = await getOnlineUserIds();
    socket.emit("initial-online-list", currentOnlineUsers);

    // If they weren't online before, broadcast to EVERYONE else that they just logged in
    if (!alreadyOnline) {
      socket.broadcast.emit("user-status-changed", { userId, status: "online" });
    }

    // Heartbeat listener
    socket.on("presence-heartbeat", async () => {
      await refreshSocketTTL(userId, socket.id);
    });
  }

  // Clean Disconnect (Close tab / Logout)
  socket.on("disconnect", async () => {
    if (userId) {
      await redis.del(`presence:user:${userId}:socket:${socket.id}`);

      const stillOnline = await isUserOnline(userId);
      if (!stillOnline) {
        // Broadcast to everyone else that this user went completely offline
        io.emit("user-status-changed", { userId, status: "offline" });
      }
    }
  });
});


// REDIS KEYSPACE NOTIFICATION: Catches silent TTL Expirations (Dirty Disconnects)
await subscriber.subscribe('__keyevent@0__:expired');
subscriber.on('message', async (channel, key) => {
  if (!key) return;
  console.log("CHANNEL:", channel);
  console.log("EXPIRED KEY:", key);

  if (key.startsWith('presence:user:')) {
    const parts = key.split(':');
    const userId = parts[2];

    const stillOnline = await isUserOnline(userId);

    if (!stillOnline) {
      io.emit("user-status-changed", {
        userId,
        status: "offline"
      });
    }
  }
});

export { server, io };
