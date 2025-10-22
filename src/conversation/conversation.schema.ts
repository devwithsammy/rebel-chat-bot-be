import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TMessageRole } from './conversation.interfaces';

@Schema({
  timestamps: true,
})
export class Conversation extends Document {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true, unique: true })
  conversationId: string; // unique id for each conversation
  @Prop({
    type: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  })
  messages: Array<{
    role: TMessageRole;
    content: string;
    timestamp: Date;
  }>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
