import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
