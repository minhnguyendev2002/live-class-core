import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ServicePackModule } from './modules/ServicePack/ServicePack.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from '@app/common-core/entities/ServicePack.entity';
import { ClassModule } from './modules/Class/Class.module';
import { LessonAttachmentModule } from './modules/LessonAttachment/LessonAttachment.module';
import Class from '../../../libs/common-core/src/entities/Class.entity';
import LessonAttachment from '../../../libs/common-core/src/entities/LessonAttachment.entity';
import { JWTMiddleware } from './middlewares/JWT.middleware';
import { Endpoint } from './utils/constants';
import { ServicePackTransactionModule } from './modules/ServicePackTransaction/ServicePackTransaction.module';
import { ServicePackTransaction } from '@app/common-core/entities/ServicePackTransaction.entity';
import { Attendance } from '@app/common-core/entities/Attendance.entity';
import AttendanceHistory from '../../../libs/common-core/src/entities/AttendanceHistory.entity';
import ShortLink from '../../../libs/common-core/src/entities/ShortLink.entity';
import Subject from '../../../libs/common-core/src/entities/Subject.entity';
import { TeachingTime } from '@app/common-core/entities/TeachingTime';
import Timetable from '../../../libs/common-core/src/entities/Timetable.entity';
import { ServicePackTransactionService } from '@app/common-core/providers/ServicePackTransaction.service';
import AgoraModule from './modules/Agora/Agora.module';
import Room from '../../../libs/common-core/src/entities/Room.entity';
import { RoomModule } from './modules/RoomController/Room.module';
import { JwtModule } from '@nestjs/jwt';
import { RabbitMQModule } from '@app/common-core/modules/RabbitMQ.module';
import RollCall from '@app/common-core/entities/RollCall.entity';
import { DocumentationModule } from './modules/Documentation/Documentation.module';
import DocsUsage from '@app/common-core/entities/DocsUsage.entity';
import Documentation from '@app/common-core/entities/Documentation.entity';
import { MongooseModule } from '@nestjs/mongoose';
import ConversationModule from './modules/Conversation/Conversation.module';
import Notification from '@app/common-core/entities/Notification.entity';
import { NotificationModule } from './modules/Notification/Notification.module';
import FileEntity from '@app/common-core/entities/File.entity';
import Folder from '@app/common-core/entities/Folder.entity';
import { FileStorageModule } from './modules/FileStorage/FileStorage.module';
import { UserRoleMiddleware } from './middlewares/UserRole.middleware';
import { TeacherRoleMiddleware } from './middlewares/TeacherRole.middleware';
import { AdminRoleMiddleware } from './middlewares/AdminRole.middleware';
import { FinallyBanRoleMiddleware } from './middlewares/FinallyBanRole.middleware';
import User from '@app/common-core/entities/User.entity';
import { UserModule } from './modules/User/User.module';
import { RouteInfo } from '@nestjs/common/interfaces/middleware/middleware-configuration.interface';

@Module({
  exports: [JwtModule, RabbitMQModule],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Attendance,
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
        Documentation,
        DocsUsage,
        Notification,
        FileEntity,
        Folder,
        User
      ],
      logging: true
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    RabbitMQModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    UserModule,
    ServicePackModule,
    ClassModule,
    LessonAttachmentModule,
    ServicePackTransactionModule,
    AgoraModule,
    RoomModule,
    DocumentationModule,
    ConversationModule,
    NotificationModule,
    FileStorageModule,
    TypeOrmModule.forFeature([ServicePackTransaction])
  ],
  controllers: [AppController],
  providers: [ServicePackTransactionService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).exclude({ method: RequestMethod.ALL, path: `${Endpoint.User}/${Endpoint.UserQuickRegister}` }).forRoutes('/');

    const adminRouters = [{ method: undefined, path: `${Endpoint.ServicePack}/${Endpoint.List}` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePack}/:id/detail` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePack}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserInfo}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserById}` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePack}/${Endpoint.ServicePackStatus}` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePackTransaction}/${Endpoint.TransPayment}` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePackTransaction}/${Endpoint.TransActivate}` }
    ];
    adminRouters.map((route) => {
      consumer.apply(AdminRoleMiddleware).exclude({ method: RequestMethod.ALL, path: `${Endpoint.User}/${Endpoint.UserQuickRegister}` }).forRoutes(route.path);
    });

    const teacherRouters = [
      { method: RequestMethod.ALL, path: `${Endpoint.Room}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Documentation}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Conversation}` },
      { method: RequestMethod.ALL, path: `${Endpoint.FileStorage}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Class}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Notification}` },
      { method: RequestMethod.ALL, path: `${Endpoint.ServicePack}/${Endpoint.ServicePackBuyingList}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserInfo}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomHostRTCToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRTMToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomAdminNetLessToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomWriterNetLessToken}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserById}` },

    ];
    teacherRouters.map((route) => {
      consumer.apply(TeacherRoleMiddleware).exclude({ method: RequestMethod.ALL, path: `${Endpoint.User}/${Endpoint.UserQuickRegister}` }).forRoutes(route.path);
    });

    const userRouters = [
      { method: RequestMethod.GET, path: `${Endpoint.Room}` },
      { method: RequestMethod.GET, path: `${Endpoint.Room}/${Endpoint.RoomByShortLink}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Conversation}/(.*)` },
      { method: RequestMethod.ALL, path: `${Endpoint.Notification}*` },
      { method: RequestMethod.ALL, path: `${Endpoint.Room}/${Endpoint.RoomMembers}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserInfo}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Room}/${Endpoint.RoomVerifyRollCall}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomUserRTCToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRTMToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomWriterNetLessToken}` },
      { method: RequestMethod.ALL, path: `${Endpoint.Agora}/${Endpoint.AgoraRoomReaderNetLessToken}` },
      { method: RequestMethod.GET, path: `${Endpoint.User}/${Endpoint.UserById}` },

    ];

    userRouters.map((route) => {
      consumer.apply(UserRoleMiddleware).exclude({ method: RequestMethod.ALL, path: `${Endpoint.User}/${Endpoint.UserQuickRegister}` }).forRoutes({ method: route.method, path: route.path });
    });

    consumer.apply(FinallyBanRoleMiddleware).exclude({ method: RequestMethod.ALL, path: `${Endpoint.User}/${Endpoint.UserQuickRegister}` }).forRoutes('/');
  }
}
