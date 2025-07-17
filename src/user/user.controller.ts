import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@UseGuards(AtGuard)
@Controller('api/v1/messages')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers(@GetCurrentUserId() myId: string) {
    return this.userService.getUsers(myId);
  }
}
