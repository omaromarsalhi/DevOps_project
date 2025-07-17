import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap: Record<string, string> = {};

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) this.userSocketMap[userId] = socket.id;
    this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
    console.log('A user connected', socket.id);
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) delete this.userSocketMap[userId];
    this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
    console.log('A user disconnected', socket.id);
  }

  @SubscribeMessage('getReceiverSocketId')
  getReceiverSocketIdMessage(@MessageBody() userId: string): string | undefined {
    return this.userSocketMap[userId];
  }

  // Public method for use in other services
  getReceiverSocketId(userId: string): string | undefined {
    return this.userSocketMap[userId];
  }
}
