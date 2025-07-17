import { Response } from 'express';

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
  maxAge: number = 24 * 60 * 60 * 1000,
): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAge,
    path: '/api/v1/auth/refresh',
  });
}
