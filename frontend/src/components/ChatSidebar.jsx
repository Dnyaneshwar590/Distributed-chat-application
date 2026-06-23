import { useState } from "react";
import {
  MessageSquare,
  Users,
  Bell,
  MessageCirclePlus,
} from "lucide-react";

import ChatList from "./ChatList";
import UserList from "./UserList";
import FriendRequestList from "./FriendRequestList";
import FriendChatList from "./FriendChatList";

import "../styles/components/ChatSidebar.css";

// 1. Accept onlineUsers as a prop from Chat.jsx
export default function ChatSidebar({ onSelectUser, onlineUsers }) {
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
          className={activeTab === "newchat" ? "active" : ""}
          onClick={() => setActiveTab("newchat")}
          title="Start New Chat"
        >
          <MessageCirclePlus size={22} />
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
        {/* 2. Pass onlineUsers down to each list that renders users */}
        {activeTab === "chats" && (
          <ChatList onSelectUser={onSelectUser} onlineUsers={onlineUsers} />
        )}

        {activeTab === "newchat" && (
          <FriendChatList onSelectUser={onSelectUser} onlineUsers={onlineUsers} />
        )}

        {activeTab === "users" && (
          <UserList onlineUsers={onlineUsers} />
        )}

        {activeTab === "requests" && (
          <FriendRequestList />
        )}
      </div>
    </div>
  );
}
