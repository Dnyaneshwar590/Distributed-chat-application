import { useState } from "react";
import {
  MessageSquare,
  Users,
  Bell
} from "lucide-react";

import ChatList from "./ChatList";
import UserList from "./UserList";
import FriendRequestList from "./FriendRequestList";

import "../styles/components/ChatSidebar.css";

export default function ChatSidebar({ onSelectUser }) {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="chat-sidebar-wrapper">
      <div className="sidebar-nav">

        <button
          className={activeTab === "chats" ? "active" : ""}
          onClick={() => setActiveTab("chats")}
          title="Chats"
        >
          <MessageSquare size={22} />
        </button>

        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
          title="Users"
        >
          <Users size={22} />
        </button>

        <button
          className={activeTab === "requests" ? "active" : ""}
          onClick={() => setActiveTab("requests")}
          title="Friend Requests"
        >
          <Bell size={22} />
        </button>

      </div>

      <div className="sidebar-content">
        {activeTab === "chats" && (
          <ChatList onSelectUser={onSelectUser} />
        )}

        {activeTab === "users" && (
          <UserList />
        )}

        {activeTab === "requests" && (
          <FriendRequestList />
        )}
      </div>
    </div>
  );
}