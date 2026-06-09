import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import api from "../services/app";
import "../styles/components/FriendRequestList.css";

export default function FriendRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(
        "/api/v1/connection/get-connection-request"
      );

      setRequests(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateConnectionRequest = async (
    senderId,
    status
  ) => {
    try {
      await api.patch("/api/v1/connection/update-connection-request", {
        senderId,
        status,
      });

      setRequests((prev) =>
        prev.filter(
          (request) =>
            request.sender._id !== senderId
        )
      );
    } catch (error) {
      console.error(
        "Update Connection Request Error:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="request-list-loading">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="request-list-sidebar">
      <div className="request-list-header">
        <h3>Friend Requests</h3>
      </div>

      {requests.length === 0 ? (
        <div className="request-list-empty">
          No pending requests
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            className="request-list-item"
          >
            <span>
              {request.sender.username}
            </span>

            <div className="request-actions">
              <button
                className="accept-btn"
                onClick={() =>
                  updateConnectionRequest(
                    request.sender._id,
                    "accepted"
                  )
                }
              >
                <Check size={18} />
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateConnectionRequest(
                    request.sender._id,
                    "rejected"
                  )
                }
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}