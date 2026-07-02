# Distributed Chat Application

A real-time distributed chat application built with Node.js, Socket.io, Redis, and React. Supports private messaging, friend connections, real-time presence tracking, and horizontal scalability via Redis pub/sub.

---

## Features

- JWT authentication with access/refresh token rotation
- Secure httpOnly cookie-based session management
- Friend connection system (send, accept, reject, block)
- Private messaging with real-time delivery via Socket.io
- Cursor-based message pagination
- Read receipts
- Real-time presence system (online/offline) with multi-tab support
- Dirty disconnect handling via Redis TTL keyspace notifications
- Redis-backed token bucket rate limiting
- Socket.io Redis adapter for horizontal scaling across multiple server instances

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- Redis (ioredis) — presence, rate limiting, pub/sub adapter
- JSON Web Tokens (jsonwebtoken)
- bcryptjs

**Frontend**
- React 19 + Vite
- Axios (with silent token refresh interceptor)
- Socket.io client
- React Router v7
- React Hot Toast
- Lucide React

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/        # Route handlers
│       ├── middlewares/        # Auth, rate limiter, socket auth
│       ├── models/             # Mongoose schemas
│       ├── redis/              # Redis client setup
│       ├── routes/             # Express routers
│       ├── utils/              # Token generators
│       ├── app.js              # Express app setup
│       ├── socket.js           # Socket.io server + presence system
│       └── index.js            # Entry point
│
└── frontend/
    └── src/
        ├── components/         # ChatSidebar, ChatWindow, UserList, etc.
        ├── pages/              # Login, Register, Chat
        ├── routes/             # App router
        ├── services/           # Axios instance, Socket.io client
        └── styles/             # CSS per component
```

---

<!-- ## Architecture -->

### Distributed Scaling

Socket.io is configured with the Redis adapter. All server instances share a Redis pub/sub channel, so a message emitted on instance A is automatically delivered to a socket connected on instance B.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or managed)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=4000

DB_URL=your_mongodb_connection_string
DB_NAME=your_database_name

SECRET_ACCESS_KEY=your_access_token_secret
SECRET_ACCESS_EXPIRY=15m

SECRET_REFRESH_KEY=your_refresh_token_secret
SECRET_REFRESH_EXPIRY=7d

CLIENT_URL=http://localhost:5173

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

> Enable Redis keyspace notifications for dirty disconnect handling:
> ```
> redis-cli config set notify-keyspace-events KEA
> ```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive tokens |
| POST | `/api/v1/auth/access-token` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout and clear session |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user/profile-details` | Get logged-in user details |
| GET | `/api/v1/user/all-user` | Get all users |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/connection/send-connection-request` | Send a friend request |
| GET | `/api/v1/connection/get-connection-request` | Get incoming requests |
| PATCH | `/api/v1/connection/update-connection-request` | Accept / reject / block |
| GET | `/api/v1/connection/get-accepted-connection-request` | Get accepted connections |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/conversation/create-conversation` | Create a conversation |
| GET | `/api/v1/conversation/get-conversation/:receiverId` | Get conversation by user |
| GET | `/api/v1/conversation/get-user-conversation` | Get all user conversations |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/message/create-message/:conversationId` | Send a message |
| GET | `/api/v1/message/get-message/:conversationId` | Fetch messages (paginated) |
| PATCH | `/api/v1/message/read-message/:conversationId` | Mark messages as read |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `initial-online-list` | Server → Client | List of online user IDs on connect |
| `user-status-changed` | Server → All | User came online or went offline |
| `presence-heartbeat` | Client → Server | Keeps presence TTL alive |
| `receive_private_message` | Server → Client | Incoming real-time message |
| `new_notification` | Server → Client | Connection request / acceptance |
| `messages_read` | Server → Room | Read receipt broadcast |

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port |
| `DB_URL` | MongoDB connection string |
| `DB_NAME` | MongoDB database name |
| `SECRET_ACCESS_KEY` | JWT access token signing secret |
| `SECRET_ACCESS_EXPIRY` | Access token expiry (e.g. `15m`) |
| `SECRET_REFRESH_KEY` | JWT refresh token signing secret |
| `SECRET_REFRESH_EXPIRY` | Refresh token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin for CORS |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password (optional) |
| `REDIS_DB` | Redis database index |
| `VITE_API_URL` | Backend base URL (frontend) |
