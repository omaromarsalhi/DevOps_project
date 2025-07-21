# 📡 Real-Time Chat Backend (NestJS)

This backend system, powered by **NestJS**, is the core engine of a **real-time chat application**. It supports **secure authentication**, **live communication**, and **file handling**, all while being designed for **scalability**, **performance**, and **security** in production environments.

---

## 🔧 Core Features

### 🔐 Authentication System
- JWT-based access and refresh token flow
- Redis-based refresh token storage with TTL
- HTTP-only cookies for refresh tokens; localStorage for access tokens
- Password hashing with bcrypt (12 rounds)
- Endpoints:
  - User registration (with email/password validation)
  - Login (with credential verification)
  - Token refresh
  - Secure logout (token invalidation)

### 🗣️ Real-Time Communication
- WebSocket via **Socket.IO**
- Room-based architecture for chat isolation
- Events handled:
  - Send/receive messages
  - Typing indicators
  - User online/offline presence
  - Join/leave chat rooms
- Message persistence in **PostgreSQL**
- **Redis** caching for recent messages

### 📁 File Handling Service
- Azure Blob Storage with SAS token generation (time-limited)
- File validation: type & size checks
- Metadata stored in PostgreSQL:
  - Original filename
  - Storage path
  - File size & MIME type
  - Owner details
- CDN-ready file URLs for client access

### 🧠 Data Management
- **PostgreSQL**:
  - User accounts and profiles
  - Chat messages
  - File metadata
  - Room information
- **Redis**:
  - Refresh token storage
  - WebSocket session handling
  - Message pub/sub system
  - Rate limiting and caching

---

## ⚙️ Operational Capabilities
- Docker containerized deployment
- Horizontal scalability potential
- Health check endpoints for service monitoring
- Structured logging and error handling
- Automated test suite for CI pipelines

---

## 🛡️ Security Highlights
- API rate limiting
- CSRF protection
- Input validation and sanitization
- Strong password hashing
- HTTPS enforcement
- Configurable CORS policy
- Regular security auditing practices

---

## 🖼️ Architecture & Sequence Diagrams

### 🔄 Login Sequence
![Login Sequence](./docs/images/login-sequence.png)

### 📝 Registration Sequence
![Register Sequence](./docs/images/register-sequence.png)

### ☁️ System Cloud Architecture
![Cloud Architecture](./docs/images/cloud-architecture.png)

---

## 🚀 Scalability & Performance

The system is optimized to support **hundreds of concurrent users** with **sub-second response times**, ensuring data consistency and secure communication across all layers.

---

## 📁 Tech Stack

| Layer            | Technology       |
|------------------|------------------|
| Backend Framework| NestJS           |
| Authentication   | JWT, Redis       |
| Real-Time Comm.  | Socket.IO        |
| Database         | PostgreSQL, Redis|
| File Storage     | Azure Blob       |
| Deployment       | Docker           |
| Monitoring       | Health Checks, Logging |
| Testing          | Jest / Supertest |

---


## 📬 Contact

For questions, contributions, or bug reports, feel free to open an issue or reach out via the associated GitHub profile.

---
