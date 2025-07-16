import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { TokenService } from './token.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';
import { setRefreshTokenCookie } from 'src/utils/cookieSetter';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseGuards(AtGuard)
  @Get('check')
  @HttpCode(HttpStatus.OK)
  async check(
    @GetCurrentUserId() userId: string,
  ): Promise<Omit<AuthResponseDto, 'tokens'>> {
    const userInfo = await this.authService.getUserById(userId);
    return userInfo;
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<Tokens, 'refresh_token'>> {
    const tokens = await this.authService.signupLocal(dto);
    setRefreshTokenCookie(
      res,
      tokens.refresh_token,
      parseInt(process.env.JWT_REFRESH_TOKEN_COOKIE_TTL!, 10) ||
        24 * 60 * 60 * 1000,
    );
    return { access_token: tokens.access_token };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'tokens'> & { access_token: string }> {
    const result = await this.authService.signinLocal(dto);
    setRefreshTokenCookie(
      res,
      result.tokens.refresh_token,
      parseInt(process.env.JWT_REFRESH_TOKEN_COOKIE_TTL!, 10) ||
        24 * 60 * 60 * 1000,
    );
    const { tokens, ...userInfo } = result;
    return { ...userInfo, access_token: tokens.access_token };
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<{ access_token: string }> {
    const tokens = await this.tokenService.refreshTokens(userId, refreshToken);
    return { access_token: tokens.access_token };
  }
}
