import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RoomController from './Room.controller';
import { RoomService } from '@app/common-core/providers/Room.service';
import Room from '../../../../../libs/common-core/src/entities/Room.entity';
import { AgoraAPIsService } from '@app/common-core/providers/AgoraAPIs.service';
import { AgoraTokenService } from '@app/common-core/providers/AgoraToken.service';
import { Attendance } from '@app/common-core/entities/Attendance.entity';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import { RabbitMQModule } from '@app/common-core/modules/RabbitMQ.module';
import { RollCallService } from '@app/common-core/providers/RollCall.service';
import RollCall from '@app/common-core/entities/RollCall.entity';
import Documentation from '@app/common-core/entities/Documentation.entity';
import DocsUsage from '@app/common-core/entities/DocsUsage.entity';
import { DocumentationService } from '@app/common-core/providers/Documentation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '@app/common-core/models/mongo/Conversation';
import { Message, MessageSchema } from '@app/common-core/models/mongo/Message';
import { UnreadMessage, UnreadMessageSchema } from '@app/common-core/models/mongo/UnreadMessage';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { ClassService } from '@app/common-core/providers/Class.service';
import Class from '@app/common-core/entities/Class.entity';
import Notification from '@app/common-core/entities/Notification.entity';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import { ShortLinkService } from '@app/common-core/providers/ShortLink.service';
import ShortLink from '@app/common-core/entities/ShortLink.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Conversation.name, schema: ConversationSchema },
    { name: Message.name, schema: MessageSchema },
    { name: UnreadMessage.name, schema: UnreadMessageSchema },
  ]), TypeOrmModule.forFeature([Room, Attendance, RollCall, Documentation, DocsUsage,Class,Notification,ShortLink]), RabbitMQModule],
  controllers: [RoomController],
  providers: [RoomService, AgoraAPIsService, AgoraTokenService, AttendanceService, RollCallService, DocumentationService, ConversationService,ClassService,NotificationService,ShortLinkService],
})
export class RoomModule {

}