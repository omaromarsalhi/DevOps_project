import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Tokens } from './types';
import { TokenService } from './token.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';
import { RedisService } from 'src/utils/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private redisService: RedisService,
  ) {}

  async signupLocal(dto: SignUpDto): Promise<Tokens> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (userExists) throw new ForbiddenException('User already exists');

    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          hash,
          username: dto.username,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRtHash(user.id, tokens.refresh_token);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image ? user.image : undefined,
      createdAt: user.createdAt,
      tokens,
    };
  }

  async getUserById(userId: string): Promise<Omit<AuthResponseDto, 'tokens'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    return {
      ...user,
      image: user.image ?? undefined,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.redisService.del(`user:${userId}:rt:`);
    return true;
  }
}
