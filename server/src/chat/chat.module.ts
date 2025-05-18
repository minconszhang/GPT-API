import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ConfigService],
})
export class ChatModule {}
