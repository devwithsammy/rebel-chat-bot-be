/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class ContinueConversationDto {
  @IsString()
  conversationId: string;

  @IsString()
  message: string;
}
