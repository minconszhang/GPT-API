import { Body, Controller, Post } from '@nestjs/common';
import { ChatDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatDto) {
    const { model, userMessage, conversationId } = body;
    return this.chatService.processChat(model, userMessage, conversationId);
  }
}
