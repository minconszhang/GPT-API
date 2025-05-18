import { IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  model: string;

  @IsString()
  userMessage: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
