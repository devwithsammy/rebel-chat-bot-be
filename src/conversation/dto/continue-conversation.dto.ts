import { IsString } from 'class-validator';

export class ContinueConversationDto {
  @IsString()
  conversationId: string;

  @IsString()
  message: string;
}
