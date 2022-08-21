import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Notification from '@app/common-core/entities/Notification.entity';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import { RabbitMQModule } from '@app/common-core/modules/RabbitMQ.module';
import Room from '@app/common-core/entities/Room.entity';
import { RoomService } from '@app/common-core/providers/Room.service';
import NotificationController from './Notification.controller';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import { Attendance } from '@app/common-core/entities/Attendance.entity';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '@app/common-core/models/mongo/Conversation';
import { Message, MessageSchema } from '@app/common-core/models/mongo/Message';
import { UnreadMessage, UnreadMessageSchema } from '@app/common-core/models/mongo/UnreadMessage';
import { ClassService } from '@app/common-core/providers/Class.service';
import Class from '@app/common-core/entities/Class.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Conversation.name, schema: ConversationSchema },
    { name: Message.name, schema: MessageSchema },
    { name: UnreadMessage.name, schema: UnreadMessageSchema },
  ]),TypeOrmModule.forFeature([Notification,Room,Attendance,Class]),RabbitMQModule],
  providers: [NotificationService,RoomService,AttendanceService,ConversationService,ClassService],
  controllers:[NotificationController]
})
export class NotificationModule {

}