import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUsers(myId: string) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: myId,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        createdAt: true,
      },
    });
  }
}
