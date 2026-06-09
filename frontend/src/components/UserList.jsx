import React, { useEffect, useState } from "react";
import api from "../services/app";
import socket  from "../services/socket.js"
import { CirclePlus } from "lucide-react";
import "../styles/components/UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/v1/user/all-user");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (date) => {
    if (!date) return "Offline";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sendFriendRequest = async (userId) => {
    try {
      setSendingId(userId);

      const response = await api.post(
        "/api/v1/connection/send-connection-request",
        {
          friendRequestUserId: userId,
        }
      );

    //   console.log("Connection Request Response:", response.data)


      alert("Connection request sent successfully!");
    } catch (error) {
      console.error(
        "Error sending connection request:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to send connection request"
      );
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="user-list-sidebar">
        <div className="user-list-loading">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-sidebar">
      {/* HEADER */}
      <div className="user-list-header-box">
        <h3>Users</h3>
      </div>

      {/* USER LIST */}
      <div className="user-list-container">
        {users.length === 0 ? (
          <div className="user-list-empty">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="user-list-item"
            >
              {/* AVATAR */}
              <div className="user-list-avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="user-avatar-image"
                  />
                ) : (
                  user.username?.charAt(0)?.toUpperCase()
                )}
              </div>

              {/* USER INFO */}
              <div className="user-list-info">
                <div className="user-name-row">
                  <span className="user-name">
                    {user.username}
                  </span>

                  <span
                    className={`user-status ${
                      user.isOnline
                        ? "online"
                        : "offline"
                    }`}
                  >
                    {user.isOnline
                      ? "● Online"
                      : "● Offline"}
                  </span>
                </div>

                <div className="user-email">
                  {user.email}
                </div>

                {!user.isOnline && (
                  <div className="user-last-seen">
                    Last seen:{" "}
                    {formatLastSeen(user.lastSeen)}
                  </div>
                )}
              </div>

              {/* SEND CONNECTION REQUEST */}
              <button
                className="friend-request-icon-btn"
                onClick={() =>
                  sendFriendRequest(user._id)
                }
                disabled={sendingId === user._id}
                title="Send Connection Request"
              >
                <CirclePlus
                  size={22}
                  color={
                    sendingId === user._id
                      ? "#999"
                      : "#111"
                  }
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}