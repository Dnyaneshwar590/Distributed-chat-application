import React, { useState } from "react";
import "../styles/components/ChatWindow.css";

function ChatWindow({ selectedUser }) {
  const [message, setMessage] = useState("");

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
            {selectedUser.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="chat-window-name">
              {selectedUser.username}
            </p>

            <p
              className={`chat-window-status ${
                selectedUser.isOnline ? "online" : "offline"
              }`}
            >
              {selectedUser.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-window-messages">

        <div className="chat-window-message other">
          Hello 👋
        </div>

        <div className="chat-window-message me">
          Hi, how are you?
        </div>

        <div className="chat-window-message other">
          I'm doing great.
        </div>

      </div>

      {/* Input */}
      <div className="chat-window-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSendMessage()
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