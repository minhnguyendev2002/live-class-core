import { Module } from '@nestjs/common';
import ConversationController from './Conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '@app/common-core/models/mongo/Conversation';
import { Message, MessageSchema } from '@app/common-core/models/mongo/Message';
import { UnreadMessage, UnreadMessageSchema } from '@app/common-core/models/mongo/UnreadMessage';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { RoomService } from '@app/common-core/providers/Room.service';
import { ClassService } from '@app/common-core/providers/Class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Room from '@app/common-core/entities/Room.entity';
import Class from '@app/common-core/entities/Class.entity';
import { RabbitMQModule } from '@app/common-core/modules/RabbitMQ.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: UnreadMessage.name, schema: UnreadMessageSchema },
    ]),
    TypeOrmModule.forFeature([Room, Class]),
    RabbitMQModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, RoomService, ClassService],
})
export default class ConversationModule {
}