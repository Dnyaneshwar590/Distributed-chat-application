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
io.adapter(createAdapter(publisher,subscriber))
io.use(socketAuthMiddleware)

// Socket connections
io.on("connection", (socket) => {

  console.log(
    "User connected:",
    socket.id
  );

  //Join conversation room
  socket.on(
    "join_conversation",
    (conversationId) => {

      socket.join(conversationId);

      console.log(
        `Socket joined room: ${conversationId}`
      );

    }
  );

  // Disconnect
  socket.on("disconnect", () => {

    console.log(
      "User disconnected:",
      socket.id
    );

  });

});

export { server, io };