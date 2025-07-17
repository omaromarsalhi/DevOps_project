import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getMessages(myId: string, userToChatId: string) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return messages;
    } catch (error) {
      console.log('Error in getMessages service: ', (error as Error).message);
      throw new Error('Failed to fetch messages');
    }
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    text?: string,
    imageUrl?: string,
  ) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          senderId,
          receiverId,
          text,
          image: imageUrl,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return newMessage;
    } catch (error) {
      console.log('Error in sendMessage service: ', (error as Error).message);
      throw new Error('Failed to send message');
    }
  }
}
