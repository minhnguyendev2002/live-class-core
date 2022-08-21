import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../../utils/constants';
import { Body, Controller, Delete, Get, Headers, Post, Query } from '@nestjs/common';
import BaseController from '../../base.controller';
import { DefaultHeaders } from '../../utils/headers';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import Notification, {
  NotificationAction,
  NotificationMultipleRead,
  NotificationRead,
  NotificationRoomHandDownReq,
  NotificationRoomHandleRequestReq,
  NotificationRoomHandleRequestType,
  NotificationRoomListQuery,
  NotificationRoomReq,
  NotificationSource,
} from '@app/common-core/entities/Notification.entity';
import { GatewayMicroservice } from '@app/common-core/models/Gateway.model';
import { RoomService } from '@app/common-core/providers/Room.service';
import { RabbitMQProducerService } from '@app/common-core/providers/RabbitMQProducer.service';
import { BaseResponse } from '../../utils/response.c';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { ConversationPrefix } from '@app/common-core/util/Constant';
import User from '@app/common-core/entities/User.entity';

@ApiTags(Endpoint.Notification)
@ApiBearerAuth()
@Controller(Endpoint.Notification)
export default class NotificationController extends BaseController {
  constructor(private notificationService: NotificationService, private roomService: RoomService,
              private readonly rabbitMQProducerService: RabbitMQProducerService,
              private readonly conversationService: ConversationService,
              private attendanceService: AttendanceService) {
    super();
  }

  @Post(Endpoint.NotificationRead)
  async read(@Headers() headers: DefaultHeaders, @Body() body: NotificationRead) {
    await this.notificationService.readById(body.id);
    return this.successRes();
  }


  @Delete(Endpoint.NotificationDeleteAll)
  async deleteALL(@Headers() headers: DefaultHeaders) {
    await this.notificationService.deleteByUid(parseInt(headers._id));
    return this.successRes();
  }

  @Post(Endpoint.NotificationMultipleRead)
  async readMany(@Headers() headers: DefaultHeaders, @Body() body: NotificationMultipleRead) {
    if (body.ids.length) {
      await body.ids.map(async (id) => {
        await this.notificationService.readById(id);
      });
    }
    return this.successRes();
  }

  @Post(Endpoint.NotificationRoom)
  @ApiOperation({ description: '# socket.on(\'NOTIFICATION\')' })
  async sendRoomNotification(@Headers() headers: DefaultHeaders, @Body() body: NotificationRoomReq) {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (room) {
      if (body.action === NotificationAction.REQUEST_JOIN_ROOM) {
        const create: Notification = {
          room_id: room.id,
          class_id: room.class_id,
          user_id: room.creator,
          source: NotificationSource.ROOM,
          action: body.action,
          extra_data: {
            checked: false,
            room_id: room.id,
            class_id: room.class_id,
            sender: JSON.parse(headers._user_data) as User,
          },
        };
        const notification = await this.notificationService.create(create);
        await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, notification);
      } else {
        const att = await this.attendanceService.getAttendants(room.id);
        const attendants = att[0];
        if (attendants && attendants.length) {
          for (let i = 0; i < attendants.length; i++) {
            /* if (attendants[i].user_id !== headers._id) {

             }*/
            const create2: Notification = {
              room_id: room.id,
              class_id: room.class_id,
              user_id: attendants[i].user_id,
              source: NotificationSource.ROOM,
              action: body.action,
              extra_data: {
                checked: false,
                room_id: room.id,
                class_id: room.class_id,
                sender: JSON.parse(headers._user_data) as User,
              },
            };
            const notification2 = await this.notificationService.create(create2);
            await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, notification2);
          }
        }
      }
    } else {
      return this.notAcceptableRes('Not found room id');
    }
    return response;
  }

  @Get(Endpoint.NotificationRoomList)
  async roomNotificationList(@Headers() headers: DefaultHeaders, @Query() query: NotificationRoomListQuery) {
    const response = this.successRes();
    const results = await this.notificationService.roomByUserId(headers._id, query.room_id);
    response.data = results[0];
    response.total_record = results[1];
    return response;
  }


  @Get(Endpoint.NotificationHandUp)
  async handUpList(@Headers() headers: DefaultHeaders, @Query() query: NotificationRoomListQuery) {
    const response = this.successRes();
    const results = await this.notificationService.roomHandUpList(headers._id, query.room_id);
    response.data = results[0];
    response.total_record = results[1];
    return response;
  }

  @Post(Endpoint.NotificationHandDown)
  async handDown(@Headers() headers: DefaultHeaders, @Body() body: NotificationRoomHandDownReq) {
    if (body.notification_ids && body.notification_ids.length) {
      body.notification_ids.map((item) => {
        this.notificationService.roomHandDown(item);
      });
    }
    return this.successRes();
  }


  @Get(Endpoint.List)
  async notificationList(@Headers() headers: DefaultHeaders) {
    const response = this.successRes();
    const results = await this.notificationService.notificationByUserId(headers._id);
    response.data = results[0];
    response.total_record = results[1];
    return response;
  }

  @Post(Endpoint.NotificationRoomJoinHandle)
  async requestJoin(@Headers() headers: DefaultHeaders, @Body() body: NotificationRoomHandleRequestReq): Promise<BaseResponse> {
    const response = this.successRes();
    const notification = await this.notificationService.findOneById(body.id);
    if (notification) {
      await this.notificationService.disableById(notification.id);
      const room = await this.roomService.findOneById(notification.room_id);
      const create: Notification = {
        room_id: room.id,
        class_id: room.class_id,
        user_id: notification.extra_data.sender.id,
        source: NotificationSource.ROOM,
        action: body.type === NotificationRoomHandleRequestType.ACCEPT ? NotificationAction.ACCEPT_JOIN_ROOM : NotificationAction.CANCEL_JOIN_ROOM,
        extra_data: {
          checked: false,
          room_id: room.id,
          class_id: room.class_id,
          sender: JSON.parse(headers._user_data) as User,
        },
      };
      const created = await this.notificationService.create(create);
      await this.attendanceService.createJoinRoom(room.id, notification.extra_data.sender);
      await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, created);

      const conversation = await this.conversationService.joinGroup(ConversationPrefix.getRoomPrefix(room.id), notification.extra_data.sender.id);
      if (conversation) {
        await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_CONVERSATION, conversation);
      }
    } else {
      return this.badRequestRes('Notification invalid');
    }
    return response;
  }

  @Post(Endpoint.NotificationRoomUnFocused)
  async unfocused(@Headers() headers: DefaultHeaders, @Body() body: NotificationRoomListQuery): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (room) {
      const create: Notification = {
        room_id: room.id,
        class_id: room.class_id,
        user_id: room.creator,
        source: NotificationSource.ROOM,
        action: NotificationAction.UNFOCUSED,
        extra_data: {
          checked: false,
          room_id: room.id,
          class_id: room.class_id,
          sender: JSON.parse(headers._user_data) as User,
        },
      };
      const notification = await this.notificationService.create(create);
      await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, notification);
    } else {
      return this.badRequestRes('room invalid');
    }

    return response;
  }


}