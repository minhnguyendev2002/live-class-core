import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UnreadDocument = UnreadMessage & Document;

@Schema({ collection:'unread_message', timestamps: {
    createdAt: 'created_at', updatedAt: 'updated_at'
  },versionKey:false })
export class UnreadMessage {

  @Prop()
  conversation_id: string;

  @Prop()
  user_id: number;

  @Prop()
  unread_count: number;
}

export const UnreadMessageSchema = SchemaFactory.createForClass(UnreadMessage);