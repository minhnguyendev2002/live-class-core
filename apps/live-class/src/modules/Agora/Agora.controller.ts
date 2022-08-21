import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../../utils/constants';
import { Body, Controller, Post,Headers } from '@nestjs/common';
import BaseController from '../../base.controller';
import {
  AgoraClassNetLessRequest,
  AgoraRoomRTCRequest,
  AgoraRtcRole,
  AgoraRTM_TokenRequest,
  AgoraTokenRequest
} from '../../utils/request';
import { AgoraTokenService } from '@app/common-core/providers/AgoraToken.service';
import { BaseResponse } from '../../utils/response.c';
import { RoomService } from '@app/common-core/providers/Room.service';
import { AgoraAPIsService } from '@app/common-core/providers/AgoraAPIs.service';
import { TokenRole } from 'netless-token';
import { DefaultHeaders } from '../../utils/headers';

@ApiTags(Endpoint.Agora)
@ApiBearerAuth()
@Controller(Endpoint.Agora)
export default class AgoraController extends BaseController {

  constructor(private agoraTokenService: AgoraTokenService, private roomService: RoomService, private agoraAPIs: AgoraAPIsService) {
    super();
  }

  @Post(Endpoint.AgoraRoomHostRTCToken)
  async generateClassHostRTCToken(@Body() body: AgoraRoomRTCRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (!room) {
      return this.badRequestRes('room_id is not matched');
    }
    const input: AgoraTokenRequest = {
      channel_name: room.name + '_' + room.id,
      role: AgoraRtcRole.PUBLISHER
    };
    response.data = this.agoraTokenService.generateRTCToken(input);
    return response;
  }

  @Post(Endpoint.AgoraRoomUserRTCToken)
  async generateClassUserRTCToken(@Body() body: AgoraRoomRTCRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (!room) {
      return this.badRequestRes('class_id is not matched');
    }
    const input: AgoraTokenRequest = {
      channel_name: room.name + '_' + room.id,
      role: AgoraRtcRole.SUBSCRIBER
    };
    response.data = this.agoraTokenService.generateRTCToken(input);
    return response;
  }

  @Post(Endpoint.AgoraRoomAdminNetLessToken)
  async generateRoomAdminNetLessToken(@Body() body: AgoraClassNetLessRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (!room) {
      return this.badRequestRes('room_id is not matched');
    } else {
      if (room.agora_room_uuid) {
        const agoraRoom = await this.agoraAPIs.getWhiteBoardRoom(room.agora_room_uuid,room.nest_less_region);
        console.log(agoraRoom);
        if (!(agoraRoom.status === 200 || agoraRoom.status === 201)) {
          const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false,room.nest_less_region);
          console.log(createRoom);
          if (createRoom.status === 200 || createRoom.status === 201) {
            console.log(createRoom.data);
            room.agora_room_uuid = createRoom.data.uuid;
            const affected = await this.roomService.updateAgoraRoomUid(room);
            console.log(affected);
          } else {
            return this.internalServerErrorRes('Agora API cannot be created the Room');
          }
        }
      } else {
        const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false,room.nest_less_region);
        console.log(createRoom);
        if (createRoom.status === 200 || createRoom.status === 201) {
          console.log(createRoom.data);
          room.agora_room_uuid = createRoom.data.uuid;
          const affected = await this.roomService.updateAgoraRoomUid(room);
          console.log(affected);
        } else {
          return this.internalServerErrorRes('Agora API cannot be created the Room');
        }
      }
      response.data = this.agoraTokenService.generateRoomNetLessToken(TokenRole.Admin, room.agora_room_uuid);
    }
    return response;
  }

  @Post(Endpoint.AgoraRoomWriterNetLessToken)
  async generateRoomWriterNetLessToken(@Body() body: AgoraClassNetLessRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (!room) {
      return this.badRequestRes('room_id is not matched');
    } else {
      if (room.agora_room_uuid) {
        const agoraRoom = await this.agoraAPIs.getWhiteBoardRoom(room.agora_room_uuid,room.nest_less_region);
        console.log(agoraRoom);
        if (!(agoraRoom.status === 200 || agoraRoom.status === 201)) {
          const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false,room.nest_less_region);
          console.log(createRoom);
          if (createRoom.status === 200 || createRoom.status === 201) {
            console.log(createRoom.data);
            room.agora_room_uuid = createRoom.data.uuid;
            const affected = await this.roomService.updateAgoraRoomUid(room);
            console.log(affected);
          } else {
            return this.internalServerErrorRes('Agora API cannot be created the Room');
          }
        }
      } else {
        const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false,room.nest_less_region);
        console.log(createRoom);
        if (createRoom.status === 200 || createRoom.status === 201) {
          console.log(createRoom.data);
          room.agora_room_uuid = createRoom.data.uuid;
          const affected = await this.roomService.updateAgoraRoomUid(room);
          console.log(affected);
        } else {
          return this.internalServerErrorRes('Agora API cannot be created the Room');
        }
      }
      response.data = this.agoraTokenService.generateRoomNetLessToken(TokenRole.Writer, room.agora_room_uuid);
    }
    return response;
  }

  @Post(Endpoint.AgoraRoomReaderNetLessToken)
  async generateRoomReaderNetLessToken(@Body() body: AgoraClassNetLessRequest): Promise<BaseResponse> {
    const response = this.successRes();
    const room = await this.roomService.findOneById(body.room_id);
    if (!room) {
      return this.badRequestRes('room_id is not matched');
    } else {
      if (room.agora_room_uuid) {
        const agoraRoom = await this.agoraAPIs.getWhiteBoardRoom(room.agora_room_uuid);
        console.log(agoraRoom);
        if (!(agoraRoom.status === 200 || agoraRoom.status === 201)) {
          const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false);
          console.log(createRoom);
          if (createRoom.status === 200 || createRoom.status === 201) {
            console.log(createRoom.data);
            room.agora_room_uuid = createRoom.data.uuid;
            const affected = await this.roomService.updateAgoraRoomUid(room);
            console.log(affected);
          } else {
            return this.internalServerErrorRes('Agora API cannot be created the Room');
          }
        }
      } else {
        const createRoom = await this.agoraAPIs.createWhiteBoardRoom(false);
        console.log(createRoom);
        if (createRoom.status === 200 || createRoom.status === 201) {
          console.log(createRoom.data);
          room.agora_room_uuid = createRoom.data.uuid;
          const affected = await this.roomService.updateAgoraRoomUid(room);
          console.log(affected);
        } else {
          return this.internalServerErrorRes('Agora API cannot be created the Room');
        }
      }
      response.data = this.agoraTokenService.generateRoomNetLessToken(TokenRole.Reader, room.agora_room_uuid);
    }
    return response;
  }


  @Post(Endpoint.AgoraRTMToken)
  @ApiOperation({description:'You can fake jwt with secret_key: live_class in https://jwt.io/ '})
  async generateRTM_Token(@Headers() headers:DefaultHeaders): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = this.agoraTokenService.generateRTMToken(headers._id);
    return response;
  }


}