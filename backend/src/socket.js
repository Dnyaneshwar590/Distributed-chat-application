import { Server } from "socket.io";
import { app } from "./app.js";
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

// attach redis adapter
io.adapter(createAdapter(publisher, subscriber))
io.use(socketAuthMiddleware)

// Socket connections
io.on("connection", (socket) => {

  const userId = socket.data.user?.id

  if (userId) {
    socket.join(userId);
    console.log(`Secure identity pipeline established for: ${userId}`);
  }

  //Join conversation room
  // socket.on("join_conversation", (conversationId) => {
  //   socket.join(conversationId);
  //   console.log(`Socket joined room: ${conversationId}`);
  // });

  /*
  socket.on("send_private_message", async (data) => {
    const { receiverId, conversationId, text } = data;
    const senderId = socket.data.user?.id; // Pulled from secure middleware

    if (!senderId || !receiverId) return;

    // Build standard message frame
    const deliveryPayload = {
      conversationId,
      senderId,
      text,
      createdAt: new Date()
    };
    
    io.to(receiverId).emit("receive_private_message", deliveryPayload);
  });
  */


  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

export { server, io };