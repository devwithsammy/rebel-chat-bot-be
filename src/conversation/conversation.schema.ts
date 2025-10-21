import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TMessageRole } from './conversation.interfaces';

@Schema({
  timestamps: true,
})
export class Conversation extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  messages: Array<{
    role: TMessageRole;
    content: string;
    timestamp: Date;
  }>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
