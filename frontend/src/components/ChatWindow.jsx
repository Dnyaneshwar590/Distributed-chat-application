import React, { useEffect, useState } from "react";
import api from "../services/app";
import "../styles/components/ChatWindow.css";
import socket from "../services/socket.js"

function ChatWindow({ selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!selectedUser?._id) return;

    fetchMessages(selectedUser._id);
  }, [selectedUser]);

  async function fetchMessages(conversationId) {
    try {
      setLoading(true);

      const res = await api.get(
        `/api/v1/message/get-message/${conversationId}`
      );

      setMessages(res.data.data || []);
    } catch (error) {
      console.error(
        "Fetch Messages Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!message.trim()) return;

    try {
      setSendingMessage(true);

      await api.post(`/api/v1/message/create-message/${selectedUser._id}`, {
        content: message,
        receiverId: selectedUser.participant._id,
      });

      // let messageObject = {
      //   receiverId : selectedUser.participant._id,
      //   conversationId: selectedUser._id,
      //   content : message
      // }

      // socket.emit("send_private_message", {
      //   receiverId: selectedUser.participant._id,
      //   conversationId: selectedUser._id,
      //   content: message
      // });

      // check disconnect reason
      socket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
      });

      await fetchMessages(selectedUser._id);
      setMessage("");
    } catch (error) {
      console.error("Send Message Error:",error.response?.data || error.message);
    } finally {
      setSendingMessage(false);
    }
  }

  useEffect(() => {
    socket.on("receive_private_message", (newMessage) => {
      console.log("New Message " + JSON.stringify(newMessage));
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive_private_message");
    };
  }, [messages]);


  if (!selectedUser) {
    return (
      <div className="chat-window-empty">
        <h2>Select a chat</h2>
        <p>
          Choose a user from the sidebar to start messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-window">

      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-window-user">

          <div className="chat-window-avatar">
            {selectedUser?.participant?.username
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>
            <p className="chat-window-name">
              {selectedUser?.participant?.username}
            </p>

            <p
              className={`chat-window-status ${selectedUser?.participant?.isOnline
                ? "online"
                : "offline"
                }`}
            >
              {selectedUser?.participant?.isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>

        </div>
      </div>

      {/* Messages */}
      <div className="chat-window-messages">

        {loading ? (
          <div className="chat-window-loading">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-window-empty-messages">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat-window-message ${msg.isMine ? "me" : "other"
                }`}>
              {msg.content}
            </div>
          ))
        )}

      </div>

      {/* Input */}
      <div className="chat-window-input-container">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          disabled={sendingMessage}
          onChange={(e) =>setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage() }
        />

        {/* Message Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={sendingMessage}>
          {sendingMessage ? "Sending..." : "Send"}
        </button>
      </div>

    </div>
  );
}

export default ChatWindow;