import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { SocketGateway } from '../socket/socket.gateway';
import { SendMessageDto } from './dto';
import { UploadService } from 'src/upload/upload.service';

@UseGuards(AtGuard)
@Controller('api/v1/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly socketGateway: SocketGateway,
    private readonly uploadService: UploadService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Param('id') userToChatId: string,
    @GetCurrentUserId() myId: string,
  ) {
    const messages = await this.messagesService.getMessages(myId, userToChatId);
    return messages;
  }

  @Post('send/:id')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('id') receiverId: string,
    @Body() sendMessageDto: SendMessageDto,
    @GetCurrentUserId() senderId: string,
  ) {
    const { text, image } = sendMessageDto;

    const newMessage = await this.messagesService.sendMessage(
      senderId,
      receiverId,
      text,
      image ? image : undefined,
    );

    const receiverSocketId = this.socketGateway.getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      this.socketGateway.server
        .to(receiverSocketId)
        .emit('newMessage', newMessage);
    }

    return newMessage;
  }
}
