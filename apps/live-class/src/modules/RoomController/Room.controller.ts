import BaseController from '../../base.controller';
import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { BaseResponse } from '../../utils/response.c';
import { AllowedRoomReq, RoomAutoRollCallReq, RoomRollCallReq, RoomVerifyRollCallReq } from '../../utils/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Description, Endpoint } from '../../utils/constants';
import { DefaultHeaders } from '../../utils/headers';
import { RoomService } from '@app/common-core/providers/Room.service';
import Room, {
  CreateRoomRequest,
  ListQueryRooms,
  RoomDetail,
  UpdateRoomRequest,
  WhiteBoardConfigReq,
} from '../../../../../libs/common-core/src/entities/Room.entity';
import { AgoraAPIsService } from '@app/common-core/providers/AgoraAPIs.service';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import {
  GatewayMicroservice,
  GatewayRoomControlActions,
  GatewayRoomControlReq,
  GatewayRoomInteractionReq,
  GatewayRoomSubKeys,
} from '@app/common-core/models/Gateway.model';
import { RabbitMQProducerService } from '@app/common-core/providers/RabbitMQProducer.service';
import { RollCallService } from '@app/common-core/providers/RollCall.service';
import { DocumentationService } from '@app/common-core/providers/Documentation.service';
import ConversationService from '@app/common-core/providers/Conversation.service';
import Notification, { NotificationAction, NotificationSource } from '@app/common-core/entities/Notification.entity';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import { ShortLinkService } from '@app/common-core/providers/ShortLink.service';
import User from '@app/common-core/entities/User.entity';

@ApiTags(Endpoint.Room)
@ApiBearerAuth()
@Controller(Endpoint.Room)
export default class RoomController extends BaseController {

  constructor(private readonly roomService: RoomService,
              private readonly agoraAPIsService: AgoraAPIsService,
              private readonly attendanceService: AttendanceService,
              private readonly rollCallService: RollCallService,
              private readonly documentationService: DocumentationService,
              private readonly conversationService: ConversationService,
              private readonly notificationService: NotificationService,
              private readonly shortLinkService: ShortLinkService,
              private readonly rabbitMQProducerService: RabbitMQProducerService) {
    super();
  }

  @Get()
  async get(@Headers() headers: DefaultHeaders, @Query('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    const data = await this.roomService.findOneById(id);
    if (data) {
      const roomDetail: RoomDetail = data as RoomDetail;
      roomDetail.docs = await this.documentationService.getDocByRoomId(id);
      const conversation = await this.conversationService.getRoomConversations(id);
      roomDetail.conversation = {
        data: conversation[0],
        record_total: conversation[1],
      };
      const shortLink = await this.shortLinkService.generateForRoom(id);
      roomDetail.nano_id = shortLink.nano_id;
      response.data = roomDetail;
    } else {
      return this.badRequestRes('room invalid');
    }
    return response;
  }


  @Post()
  async create(@Headers() headers: DefaultHeaders, @Body() body: CreateRoomRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const create = body as Room;
    create.creator =parseInt(headers._id);
    create.extra_data = {
      is_auto_roll_call: false,
      auto_roll_call_every_minutes: 5,
      white_board_config: {
        board_color: '#fff',
      },
    };
    let room = await this.roomService.create(create) as RoomDetail;
    const agoraRoomRes = await this.agoraAPIsService.createWhiteBoardRoom(false, room.nest_less_region);
    if (!(agoraRoomRes.status === HttpStatus.OK || agoraRoomRes.status === HttpStatus.CREATED)) {
      response.message = 'create room success, error while connect Agora APIs';
      response.status = HttpStatus.CONTINUE;
    } else {
      room.agora_room_uuid = agoraRoomRes.data.uuid;
      await this.roomService.updateAgoraRoomUid(room);
    }
    const user = JSON.parse(headers._user_data) as User;
    const conversation = await this.conversationService.createConversationFromRoomId(room.id, user);
    room.conversation = {
      data: [conversation],
      record_total: 1,
    };
    await this.attendanceService.createJoinRoom2(room, user);
    const shortLink = await this.shortLinkService.generateForRoom(room.id);
    room.nano_id = shortLink.nano_id;
    response.data = room;
    this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_CONVERSATION, room.conversation).then();
    return response;
  }

  @Put()
  async update(@Headers() headers: DefaultHeaders, @Body() body: UpdateRoomRequest): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.roomService.update(body as Room);
    return response;
  }

  @Get(Endpoint.RoomSubscribedTopics)
  @ApiOperation({
    summary: 'Socket subscribed topics(events)',
    description: Description.RoomSubscribedTopics,
  })
  async getAllowedRooms(@Headers() headers: DefaultHeaders, @Body() body: AllowedRoomReq): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = [
      GatewayRoomSubKeys.ROOM_INTERACTION,
      GatewayRoomSubKeys.ROOM_CONTROL,
      GatewayRoomSubKeys.ROOM_TRACE,
    ];
    return response;
  }

  @Post(Endpoint.RoomInteraction)
  async sendRoomInteraction(@Headers() headers: DefaultHeaders, @Body() body: GatewayRoomInteractionReq): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (room) {
      const create: Notification = {
        room_id: room.id,
        class_id: room.class_id,
        user_id: body.payload.user_id,
        source: NotificationSource.ROOM,
        action: NotificationAction.CLAP,
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
      return this.notAcceptableRes('Not found room id');
    }

    return response;
  }


  @Post(Endpoint.RoomControl)
  async sendRoomControl(@Headers() headers: DefaultHeaders, @Body() body: GatewayRoomControlReq): Promise<BaseResponse> {
    const response = this.successRes();
    await this.rabbitMQProducerService.send(GatewayRoomSubKeys.ROOM_CONTROL, body);
    return response;
  }

  @Delete()
  async delete(@Headers() headers: DefaultHeaders, @Query('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.roomService.delete(id);
    return response;
  }

  @Get(Endpoint.RoomsByHost)
  async listRoomByHost(@Headers() headers: DefaultHeaders, @Query() query: ListQueryRooms): Promise<BaseResponse> {
    const response = this.successRes();
    if (!query.page) {
      query.page = 1;
    }
    if (!query.page_size) {
      query.page_size = 20;
    }
    const data = await this.roomService.findByCreatorId(headers._id, query);
    const rooms = data[0];
    let data1 = [];
    if (rooms) {
      for (let i = 0; i < rooms.length; i++) {
        const detail = rooms[i] as RoomDetail;
        const shortLink = await this.shortLinkService.generateForRoom(rooms[i].id);
        detail.nano_id = shortLink.nano_id;
        data1 = [...data1, detail];
      }
    }
    response.data = data1;
    response.total_record = data[1];
    return response;
  }


  @Get(Endpoint.RoomMembers)
  async roomMembers(@Headers() headers: DefaultHeaders, @Query() request: AllowedRoomReq): Promise<BaseResponse> {
    const response = this.successRes();
    const data = await this.attendanceService.getAttendants(request.room_id);
    response.data = data[0];
    response.total_record = data[1];
    return response;
  }

  @Post(Endpoint.RoomAutoRollCall)
  async autoRollCall(@Headers() headers: DefaultHeaders, @Body() request: RoomAutoRollCallReq): Promise<BaseResponse> {
    const response = this.successRes();
    request.user = JSON.parse(headers._user_data);
    await this.roomService.rollCallUpdate(request.room_id, request.is_auto_roll_call, request.auto_roll_call_every_minutes);
    await this.rabbitMQProducerService.send(GatewayMicroservice.ACTIVE_AUTO_ROLL_CALL, request);
    return response;
  }

  @Get(Endpoint.RoomByShortLink)
  async roomByShortLink(@Headers() headers: DefaultHeaders, @Param('nano_id') nanoId: string): Promise<BaseResponse> {
    const response = this.successRes();
    const shortLink = await this.shortLinkService.getJoinRoomShortLink(nanoId);
    if (shortLink) {
      const room = await this.roomService.findOneById(shortLink.room_id);
      const roomDetail: RoomDetail = room as RoomDetail;
      roomDetail.docs = await this.documentationService.getDocByRoomId(room.id);
      const conversation = await this.conversationService.getRoomConversations(room.id);
      roomDetail.conversation = {
        data: conversation[0],
        record_total: conversation[1],
      };
      roomDetail.nano_id = shortLink.nano_id;
      response.data = roomDetail;
    } else {
      return this.badRequestRes('room invalid');
    }
    return response;
  }

  @Post(Endpoint.RoomGenerateShortLink)
  async generateShortLink(@Headers() headers: DefaultHeaders, @Body() body: AllowedRoomReq): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.shortLinkService.generateForRoom(body.room_id);
    return response;
  }

  @Post(Endpoint.RoomEnd)
  async endRoom(@Headers() headers: DefaultHeaders, @Body() body: AllowedRoomReq): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (room.creator !== parseInt(headers._id)) {
      return this.badRequestRes('you\'re not a host of this room');
    }
    const att = await this.attendanceService.getAttendants(room.id);
    const attendants = att[0];
    if (attendants && attendants.length) {
      for (let i = 0; i < attendants.length; i++) {
        const create: Notification = {
          room_id: room.id,
          class_id: room.class_id,
          user_id: attendants[i].user_id,
          source: NotificationSource.ROOM,
          action: NotificationAction.END_ROOM,
          extra_data: {
            checked: false,
            room_id: room.id,
            class_id: room.class_id,
            sender: JSON.parse(headers._user_data) as User,
          },
        };
        const notification = await this.notificationService.create(create);
        await this.rabbitMQProducerService.send(GatewayMicroservice.END_ROOM, room);
        await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, notification);
      }
    }
    return response;
  }

  @Post(Endpoint.RoomRollCall)
  async rollCall(@Headers() headers: DefaultHeaders, @Body() request: RoomRollCallReq): Promise<BaseResponse> {
    const response = this.successRes();
    request.user = JSON.parse(headers._user_data);
    await this.rabbitMQProducerService.send(GatewayMicroservice.ACTIVE_ROLL_CALL, request);
    return response;
  }

  @Post(Endpoint.RoomVerifyRollCall)
  async verifyRollCall(@Headers() headers: DefaultHeaders, @Body() request: RoomVerifyRollCallReq): Promise<BaseResponse> {
    const response = this.successRes();
    const rollCall = await this.rollCallService.findOneById(request.roll_call_id);
    if (rollCall) {
      await this.rollCallService.verifyRollCall(request.roll_call_id);
      const create: Notification = {
        room_id: rollCall.room_id,
        class_id: rollCall.class_id,
        user_id: rollCall.creator,
        source: NotificationSource.ROOM,
        action: NotificationAction.VERIFIED_ROLL_CODE,
        extra_data: {
          checked: false,
          room_id: rollCall.room_id,
          class_id: rollCall.class_id,
          sender: JSON.parse(headers._user_data) as User,
        },
      };
      const notification = await this.notificationService.create(create);
      await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_NOTIFICATION, notification);
    } else {
      return this.notAcceptableRes('Roll call invalid');
    }
    return response;
  }

  @Post(Endpoint.RoomWhiteBoardConfig)
  async whiteBoardConfig(@Headers() headers: DefaultHeaders, @Body() request: WhiteBoardConfigReq): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(request.room_id);
    if (!room) {
      return this.badRequestRes('room invalid');
    }
    if (!room.extra_data) {
      room.extra_data = {
        white_board_config: {
          board_color: '#fff',
        },
      };
    }
    console.log('room', room.extra_data);
    if (!room.extra_data.white_board_config) {
      room.extra_data.white_board_config = {
        board_color: '#fff',
      };
    }
    if (!room.extra_data.white_board_config.board_color) {
      room.extra_data.white_board_config.board_color = '#fff';
    }
    room.extra_data.white_board_config.board_color = request.board_color;
    await this.roomService.update(room);
    const data: GatewayRoomControlReq = {
      room_id: room.id,
      action: GatewayRoomControlActions.WHITE_BOARD_CONFIG,
      payload: {
        white_board_config: room.extra_data.white_board_config,
      },
    };
    await this.rabbitMQProducerService.send(GatewayRoomSubKeys.ROOM_CONTROL, data);
    response.data = room.extra_data.white_board_config;
    return response;
  }

}