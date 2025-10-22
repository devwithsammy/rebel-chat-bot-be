/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class StartConversationDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  conversationId?: string;
}
