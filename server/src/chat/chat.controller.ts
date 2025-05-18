import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

class ChatDto {
  model: string;
  userMessage: string;
  conversationId?: string;
}

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatDto) {
    const { model, userMessage, conversationId } = body;
    return this.chatService.processChat(model, userMessage, conversationId);
  }
}
