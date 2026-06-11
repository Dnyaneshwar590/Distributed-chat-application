import React, { useEffect, useState } from "react";
import api from "../services/app";
import "../styles/components/ChatWindow.css";

function ChatWindow({ selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function handleSendMessage() {
    if (!message.trim()) return;

    console.log("Sending:", message);

    setMessage("");
  }

  if (!selectedUser) {
    return (
      <div className="chat-window-empty">
        <h2>Select a chat</h2>
        <p>Choose a user from the sidebar to start messaging.</p>
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
              className={`chat-window-message ${
                msg.isMine ? "me" : "other"
              }`}
            >
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
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleSendMessage()
          }
        />

        <button onClick={handleSendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatWindow;