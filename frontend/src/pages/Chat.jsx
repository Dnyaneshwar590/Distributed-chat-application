import { useEffect, useState } from "react";
import "../styles/Chat.css";
import toast from "react-hot-toast";
import socket from "../services/socket.js"
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
 // 1. Rename to 'onlineUsers' (plural) for clarity. This is your single source of truth.
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Notification 
  // useEffect(() => {
  //   socket.on("new_notification", (notification) => {
  //     toast.success(notification.text, {
  //       duration: 10000,
  //     });
  //   });

  //   return () => {
  //     socket.off("new_notification");
  //   };
  // }, []);

   useEffect(() => {
    // Connect the socket automatically when this main page mounts
    socket.connect();

    // Notification listener
    socket.on("new_notification", (notification) => {
      toast.success(notification.text, {
        duration: 10000,
      });
    });

    // 2. Fetch the initial list of everyone who is online right now
    socket.on("initial-online-list", (userIds) => {
      setOnlineUsers(userIds);
    });

    // 3. Listen for live updates when other users log in or time out (TTL)
    socket.on("user-status-changed", ({ userId, status }) => {
      setOnlineUsers((prev) => {
        if (status === "online") {
          // Add them only if they are not already in the array
          return prev.includes(userId) ? prev : [...prev, userId];
        } else {
          // Remove them from the array completely
          return prev.filter((id) => id !== userId);
        }
      });
    });

    // Clean up ALL listeners securely when this page unmounts
    return () => {
      socket.off("new_notification");
      socket.off("initial-online-list");
      socket.off("user-status-changed");
    };
  }, []); // Leaving dependency array empty prevents duplicate listener loops

  console.log("Current Online User IDs:", onlineUsers);

  const [input, setInput] = useState("");
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: input,
      sender: "me",
    };

    sendMessage((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <h2 className="logo">Chats</h2>

        <ChatSidebar onSelectUser={setSelectedUser} onlineUsers={onlineUsers} />
      </div>

      <ChatWindow selectedUser={selectedUser}
      />
    </div>
  );
};

export default Chat;