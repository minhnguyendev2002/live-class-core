import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  SchemaTypes, Types } from 'mongoose';
import { Message, MessageDocument } from '@app/common-core/models/mongo/Message';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import User from '@app/common-core/entities/User.entity';

export type ConversationDocument = Conversation & Document;


export type ConversationMessage = Message & {
  _id: Types.ObjectId;
};

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'conversation',
  versionKey: false,
})
export class Conversation {


  @ApiProperty()
  @Prop()
  name: string;

  @Prop()
  @ApiProperty()
  conversation_id: string;

  @Prop({ type: SchemaTypes.Array })
  participants: number[];

  @Prop({ type: Object })
  sender?: User;

  @Prop()
  class_id: number;

  @Prop({ type: Object })
  message?: ConversationMessage;

  @Prop()
  host: number;

  @Prop()
  room_id: number;

  @Prop()
  message_count: number;

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
