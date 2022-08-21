import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import User from '@app/common-core/entities/User.entity';

export type MessageDocument = Message & Document;

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCS = 'docs',
  PDF = 'pdf',
}

export class Attachment {
  @ApiProperty()
  @Prop()
  id: string;
  @ApiProperty({enum:[AttachmentType.AUDIO,AttachmentType.IMAGE,AttachmentType.PDF,AttachmentType.DOCS,AttachmentType.VIDEO]})
  @Prop()
  type: AttachmentType;
  @Prop()
  @ApiProperty()
  url: string;
  @Prop()
  preview_url: string;
}

export enum MessageType {
  MESSAGE = 'message',
  ADD_MEMBER = 'add_member',
  JOIN_GROUP = 'join_group',
  CREATED_GROUP = 'created_group'
}


@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'message', versionKey: false })
export class Message {

  @Prop()
  conversation_id: string;

  @Prop()
  text: string;


  @Prop()
  host: number;

  @Prop()
  type: MessageType;

  @Prop()
  class_id: number;

  @Prop()
  room_id: number;

  @Prop()
  attachments: Attachment[];

  @Prop({ type: SchemaTypes.Array })
  read_by: string[];

  @Prop({ type: Object })
  sender?: User;


}

export const MessageSchema = SchemaFactory.createForClass(Message);

export class SendMessageReq {
  @ApiProperty()
  text: string;
  @ApiProperty({type:[Attachment]})
  attachments: Attachment[];

}


export class EditMessageTextReq {
  @ApiProperty()
  text: string;

}