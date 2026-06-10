import React, { useEffect, useState } from "react";
import api from "../services/app";

import "../styles/components/FriendChatList.css";

export default function FriendChatList({
    onSelectUser,
}) {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingConversation, setCreatingConversation] =
        useState(null);

    useEffect(() => {
        fetchAvailableConnections();
    }, []);


    async function fetchAvailableConnections() {
        try {
            const res = await api.get("/api/v1/connection/get-accepted-connection-request");
            setConnections(res.data.data || []);
        } catch (error) {
            console.error("Fetch Available Connections Error:", error);
        } finally {
            setLoading(false);
        }
    }

    async function createConversation(participantId) {
        try {
            setCreatingConversation(participantId);
            const res = await api.post("/api/v1/conversation/create-conversation", {
                participantId,
            }
            );

            const conversation = res.data.data;
            // Open chat window
            onSelectUser?.(conversation);
        } catch (error) {
            console.error(
                "Create Conversation Error:",
                error.response?.data ||
                error.message
            );
        } finally {
            setCreatingConversation(null);
        }
    }

    if (loading) {
        return (
            <div className="new-chat-loading">
                Loading connections...
            </div>
        );
    }

    return (
        <div className="new-chat-sidebar">
            <div className="new-chat-header">
                <h3>Start New Chat</h3>
            </div>

            <div className="new-chat-container">
                {connections.length === 0 ? (
                    <div className="new-chat-empty">
                        No available connections
                    </div>
                ) : (
                    connections.map((user) => (
                        <div key={user._id}
                            className="new-chat-item"
                            onClick={() => !creatingConversation && createConversation(user._id)
                            }>
                            <div className="new-chat-avatar">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="new-chat-avatar-image"
                                    />
                                ) : (user.username?.charAt(0)?.toUpperCase())}
                            </div>

                            <div className="new-chat-info">
                                <div className="new-chat-name">
                                    {user.username}
                                </div>

                                <div className="new-chat-subtitle">
                                    {creatingConversation === user._id
                                        ? "Creating conversation..."
                                        : "Start a conversation"}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}