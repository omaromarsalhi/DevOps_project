import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { StrategyOptionsWithRequest } from 'passport-jwt';
import type { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET_KEY');
    if (!secret) {
      throw new Error(
        'JWT_REFRESH_SECRET_KEY is not defined in the configuration',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refreshToken,
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    } satisfies StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
