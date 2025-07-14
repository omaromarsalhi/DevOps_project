import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Tokens } from './types';
import { TokenService } from './token.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
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
      _id: user.id,
      username: user.username,
      email: user.email,
      tokens,
    };
  }

  // res.status(200).json({
  //   _id: user._id,
  //   fullName: user.fullName,
  //   email: user.email,
  //   profilePic: user.profilePic,
  // });

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }
}
