import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './conversation.schema';
import { TMessageRole } from './conversation.interfaces';
import { randomUUID } from 'crypto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}
  async createConversation(userId: string) {
    const conversationId = randomUUID();
    const convo = await this.conversationModel.create({
      userId,
      conversationId,
      messagees: [],
    });
    return convo;
  }
  async getConversation(userId: string, conversationId: string) {
    const convo = await this.conversationModel.findOne({
      userId,
      conversationId,
    });
    return convo;
  }

  async appendMessage(
    userId: string,
    conversationId: string,
    role: TMessageRole,
    content: string,
  ) {
    const convo = await this.getConversation(userId, conversationId);
    if (!convo) {
      throw new BadRequestException('Conversation not found.');
    }
    convo.messages.push({ role, content, timestamp: new Date() });
    await convo.save();
    return convo;
  }

  async getConversationContext(userId: string, conversationId: string) {
    const convo = await this.getConversation(userId, conversationId);
    if (!convo) {
      throw new BadRequestException('Conversation not found.');
    }
    return convo?.messages ?? [];
  }

  async getUserConversations(userId: string) {
    return this.conversationModel
      .find({ userId })
      .select('conversationId createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean()
      .then((list) =>
        list.map((c) => ({
          conversationId: c.conversationId,
          lastUserMessage: c.messages.filter((m) => m.role === 'user').pop()
            ?.content,
          lastAssistantMessage: c.messages
            .filter((m) => m.role === 'assistant')
            .pop()?.content,
          updatedAt: c.updatedAt,
        })),
      );
  }
}
