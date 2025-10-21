import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './conversation.schema';
import { TMessageRole } from './conversation.interfaces';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async getOrCreateConversation(userId: string) {
    let convo = await this.conversationModel.findOne({
      userId,
    });
    if (!convo) {
      convo = await this.conversationModel.create({
        userId,
        messages: [],
      });
    }
    return convo;
  }

  async appendMessage(userId: string, role: TMessageRole, content: string) {
    const convo = await this.getOrCreateConversation(userId);
    convo.messages.push({ role, content, timestamp: new Date() });
    await convo.save();
    return convo;
  }

  async getConversationContext(userId: string) {
    const convo = await this.getOrCreateConversation(userId);
    return convo.messages;
  }
  async clearConversation(userId: string) {
    return this.conversationModel.updateOne(
      { userId },
      { $set: { messages: [] } },
    );
  }
}
