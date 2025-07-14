import { Tokens } from '../types';

export class AuthResponseDto {
  _id: string;
  username: string;
  email: string;
  tokens: Tokens;
}
