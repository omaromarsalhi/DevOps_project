import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis.service';

import { JwtPayload, Tokens } from './types';

@Injectable()
export class TokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
  ) {}

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    // Get hashedRt from Redis
    const hashedRt = await this.redisService.get(`user:${userId}:rt:`);
    if (!hashedRt) throw new ForbiddenException('Access Denied 1');

    // const rtMatches = await argon.verify(hashedRt, rt);
    // if (!rtMatches) throw new ForbiddenException('Access Denied 2');

    // You may want to get user email from DB, or cache it elsewhere
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Access Denied 3');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.redisService.set(`user:${userId}:rt:`, hash, 60 * 60 * 24);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION_TIME', '5m'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET_KEY'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME', '1d'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
