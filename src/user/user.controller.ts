import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from 'src/common/decorators';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(AtGuard)
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(@GetCurrentUserId() myId: string) {
    return this.userService.getUsers(myId);
  }

  @Patch('profile/update')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @GetCurrentUserId() myId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(myId, dto);
  }
}
