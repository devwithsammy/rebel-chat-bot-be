import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';

import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { IAuthenticatedRequest } from 'src/common/types/authenticated-request.interface';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async sendMessage(
    @Body()
    body: {
      prompt: string;
    },
    @Req() req: IAuthenticatedRequest,
  ) {
    const userId = req?.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    await this.conversationService.appendMessage(userId, 'user', body.prompt);

    const messages =
      await this.conversationService.getConversationContext(userId);

    // Prepare context for OpenRouter
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call OpenRouter API
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: formattedMessages,
        }),
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const assistantReply = result?.choices?.[0]?.message?.content || '...';
    await this.conversationService.appendMessage(
      userId,
      'assistant',
      assistantReply,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { reply: assistantReply };
  }
}
