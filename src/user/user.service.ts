import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
  }
}
