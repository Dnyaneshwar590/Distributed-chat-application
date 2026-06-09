import React, { useEffect, useState } from "react";
import api from "../services/app.js";

import "../styles/components/ChatList.css";

export default function ChatList({ onSelectUser }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/api/v1/conversation/get-user-conversation");

        setConversations(res.data.data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getLastMessageText = (conversation) => {
    const message = conversation?.lastMessage;
    const participant = conversation?.participant;

    if (!message) {
      return "Start a conversation";
    }

    switch (message.messageType) {
      case "text":
        return message.content;

      case "image":
        return `${participant?.username} sent a photo`;

      case "video":
        return `${participant?.username} sent a video`;

      case "audio":
        return `${participant?.username} sent an audio message`;

      case "file":
        return `${participant?.username} sent a file`;

      default:
        return `${participant?.username} sent a message`;
    }
  };

  if (loading) {
    return (
      <div className="chat-list-sidebar">
        <div className="chat-list-loading">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="chat-list-sidebar">
      <div className="chat-list-container">
        {conversations.length === 0 ? (
          <div className="chat-list-empty">
            No conversations found
          </div>
        ) : (
          conversations.map((conversation) => {
            const participant = conversation.participant;

            return (
              <div
                key={conversation._id}
                className="chat-list-item"
                onClick={() => onSelectUser?.(conversation)}
              >
                <div className="chat-list-avatar">
                  {participant?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="chat-list-info">
                  <div className="chat-list-header">
                    <div className="chat-list-name">
                      {participant?.username || "Unknown User"}
                    </div>
                  </div>

                  <div className="chat-list-lastmsg">
                    {getLastMessageText(conversation)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}