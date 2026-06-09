import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: true,
    withCredentials: true,
    // query: {}
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message)
})

export default socket;