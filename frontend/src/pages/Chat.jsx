import { useEffect, useState } from "react";
import "../styles/Chat.css";
import socket from "../services/socket.js"
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("new_notification", (notification) => {
      console.log("New Notification:", notification);
      setNotifications((prev) => [notification, ...prev,]);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  useEffect(() => {
    console.log(selectedUser);

    socket.emit("join_conversation", selectedUser?._id);
  }, [selectedUser])

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

        <ChatSidebar onSelectUser={setSelectedUser} />
      </div>

      <ChatWindow selectedUser={selectedUser}
      />
    </div>
  );
};

export default Chat;