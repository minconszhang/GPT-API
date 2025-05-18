import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Prompt } from './prompt';

@Module({
  controllers: [ChatController],
  providers: [ChatService, Prompt],
})
export class ChatModule {}
