import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    withCredentials: true,
});

let heartbeatInterval = null;

// Start the heartbeat loop immediately when the socket successfully connects
socket.on("connect", () => {
    console.log("Connected to socket server. Starting presence heartbeat...");
    
    // Clear any existing interval to prevent duplicates
    if (heartbeatInterval) clearInterval(heartbeatInterval);

    // Send a "ping" to the server every 25 seconds to keep the 60s Redis TTL alive
    heartbeatInterval = setInterval(() => {
        if (socket.connected) {
            socket.emit("presence-heartbeat");
        }
    }, 25000); 
});

// Stop the heartbeat loop if the socket disconnects 
socket.on("disconnect", () => {
    console.log("Disconnected from socket server. Stopping heartbeat.");
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message)
});

export default socket;
