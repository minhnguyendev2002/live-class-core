import { Module } from '@nestjs/common';
import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '@app/common-core/entities/Attendance.entity';
import AttendanceHistory from '@app/common-core/entities/AttendanceHistory.entity';
import Class from '@app/common-core/entities/Class.entity';
import LessonAttachment from '@app/common-core/entities/LessonAttachment.entity';
import { ServicePack } from '@app/common-core/entities/ServicePack.entity';
import { ServicePackTransaction } from '@app/common-core/entities/ServicePackTransaction.entity';
import ShortLink from '@app/common-core/entities/ShortLink.entity';
import Subject from '@app/common-core/entities/Subject.entity';
import { TeachingTime } from '@app/common-core/entities/TeachingTime';
import Timetable from '@app/common-core/entities/Timetable.entity';
import Room from '@app/common-core/entities/Room.entity';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from './events.gateway';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RoomService } from '@app/common-core/providers/Room.service';
import RollCall from '@app/common-core/entities/RollCall.entity';
import { TaskRollCallService } from './services/TaskRollCall.service';
import { RollCallService } from '@app/common-core/providers/RollCall.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '@app/common-core/models/mongo/Conversation';
import { Message, MessageSchema } from '@app/common-core/models/mongo/Message';
import { UnreadMessage, UnreadMessageSchema } from '@app/common-core/models/mongo/UnreadMessage';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { ClassService } from '@app/common-core/providers/Class.service';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import Notification from '@app/common-core/entities/Notification.entity';
import User from '@app/common-core/entities/User.entity';

@Module({
  exports: [JwtModule],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        Attendance,
        AttendanceHistory,
        Class,
        LessonAttachment,
        ServicePack,
        ServicePackTransaction,
        ShortLink,
        Subject,
        TeachingTime,
        Timetable,
        Room,
        RollCall,
        Notification,
        User
      ],
      logging: true
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: UnreadMessage.name, schema: UnreadMessageSchema }
    ]),
    TypeOrmModule.forFeature([Attendance, Room, RollCall,Class,Notification]),
    ScheduleModule.forRoot()
  ],
  controllers: [ReceiverController],
  providers: [ReceiverService, EventsGateway, AttendanceService, TaskRollCallService, RoomService, RollCallService, ConversationService,ClassService,NotificationService]
})
export class ReceiverModule {
}
