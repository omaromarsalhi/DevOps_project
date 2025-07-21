# ChatFlow - Real-Time Chat Application

![Architecture Diagram](https://i.imgur.com/your-architecture-diagram.png)

A full-stack chat application with real-time messaging, authentication, and file sharing capabilities.

## 🌟 Features

### Authentication
- JWT-based login/register system
- Access token in localStorage
- Refresh token in HTTP-only cookies
- Redis-backed session management

### Messaging
- Real-time chat with WebSockets
- Message history persistence
- Typing indicators
- Online status tracking

### Media Support
- Image uploads to Azure Blob Storage
- File size validation
- Thumbnail generation

## 🛠 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Redis
- Socket.IO Server

### Infrastructure
- Azure VM (Ubuntu)
- Nginx reverse proxy
- Docker containers
- Azure Blob Storage

## 🚀 Deployment

### Prerequisites
- Azure account
- Docker installed
- Node.js 18+

### Setup Instructions

1. **Backend Setup**
```bash
cd backend
cp .env.example .env
npm install
docker-compose up -d
npm run start:prod
