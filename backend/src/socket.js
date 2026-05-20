import { Server } from "socket.io";
import { app } from "./app.js";
import http from "http";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

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