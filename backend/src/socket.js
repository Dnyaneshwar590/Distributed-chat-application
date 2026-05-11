import { Server } from "socket.io";
import { app } from "./app.js";
import http from "http";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/*
  Socket connections
*/
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

export { server, io };