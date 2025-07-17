import { Tokens } from '../types';

export class AuthResponseDto {
  id: string;
  username: string;
  email: string;
  tokens: Tokens;
  image?: string;
  createdAt: Date;
}
