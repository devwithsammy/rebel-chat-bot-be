import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { TUserRole } from '../user.type';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
  })
  firstName: string;

  @Prop()
  lastname: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    default: 'user',
  })
  role?: TUserRole;
  picture: string;
  @Prop()
  googleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
