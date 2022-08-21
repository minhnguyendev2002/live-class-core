import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { WhiteBoardConfig } from '@app/common-core/entities/Room.entity';
import User from '@app/common-core/entities/User.entity';

export enum GatewayMicroservice {
  ACTIVE_AUTO_ROLL_CALL = 'ACTIVE_AUTO_ROLL_CALL',
  ACTIVE_ROLL_CALL = 'ACTIVE_ROLL_CALL',
  VERIFY_ROLL_CALL = 'VERIFIED_ROLL_CALL',
  BROADCAST_CONVERSATION = 'BROADCAST_CONVERSATION',
  BROADCAST_NOTIFICATION = 'BROADCAST_NOTIFICATION',
  END_ROOM = 'END_ROOM',
}


export enum GatewayRoomSubKeys {
  ROOM_INTERACTION = 'ROOM_INTERACTION', ROOM_CONTROL = 'ROOM_CONTROL',
  ROOM_TRACE = 'ROOM_TRACE',
  NOTIFICATION = 'NOTIFICATION',
  USER_MESSAGE = 'USER_MESSAGE-',
  ERROR_CONNECTION = 'ERROR_CONNECTION',
}

export enum GatewayUserPushMessage {
  PUSH_MESSAGE = 'PUSH_MESSAGE', DELETE_MESSAGE = 'DELETE_MESSAGE', EDIT_MESSAGE = 'EDIT_MESSAGE',
}

export enum GatewayRoomTraceActions {
  ONLINE = 'ONLINE', OFFLINE = 'OFFLINE'
}

export class GatewayRoomTracePayload {
  user_id: number;
}

export class GatewayRoomTraceRes {
  action: GatewayRoomTraceActions;
  payload: GatewayRoomTracePayload;
}


export enum GatewayRoomInteractionActions {
  CLAP = 'CLAP', LOVE = 'LOVE', LIKE = 'LIKE', ANGRY = 'ANGRY', UN_CLAP = 'UN_CLAP', UN_LOVE = 'UN_LOVE', UN_LIKE = 'UN_LIKE', UN_ANGRY = 'UN_ANGRY'
  , HAND_UP = 'HAND_UP', HAND_DOWN = 'HAND_DOWN', ROLL_CALL = 'ROLL_CALL', VERIFIED_ROLL_CALL = 'VERIFIED_ROLL_CALL', REQUEST_JOIN_ROOM = 'REQUEST_JOIN_ROOM', ACCEPT_JOIN_ROOM = 'ACCEPT_JOIN_ROOM',
  CANCEL_JOIN_ROOM = 'CANCEL_JOIN_ROOM',
  REQUEST_TURN_ON_MIC = 'REQUEST_TURN_ON_MIC', CANCEL_TURN_ON_MIC = 'CANCEL_TURN_ON_MIC', ACCEPT_TURN_ON_MIC = 'ACCEPT_TURN_ON_MIC',
  REQUEST_TURN_OFF_MIC = 'REQUEST_TURN_OFF_MIC', CANCEL_TURN_OFF_MIC = 'CANCEL_TURN_OFF_MIC', ACCEPT_TURN_OFF_MIC = 'ACCEPT_TURN_OFF_MIC',
  REQUEST_TURN_ON_CAMERA = 'REQUEST_TURN_ON_CAMERA', CANCEL_TURN_ON_CAMERA = 'CANCEL_TURN_ON_CAMERA', ACCEPT_TURN_ON_CAMERA = 'ACCEPT_TURN_ON_CAMERA',
  REQUEST_TURN_OFF_CAMERA = 'REQUEST_TURN_OFF_CAMERA', CANCEL_TURN_OFF_CAMERA = 'CANCEL_TURN_OFF_CAMERA', ACCEPT_TURN_OFF_CAMERA = 'ACCEPT_TURN_OFF_CAMERA',
}

export class GatewayRoomInteractionPayload {
  @ApiPropertyOptional()
  user_id: number;
  @ApiPropertyOptional()
  roll_call_id?: number;
}


export class GatewayRoomInteractionRes {
  @ApiProperty({ enum: GatewayRoomInteractionActions })
  @IsNotEmpty()
  action: GatewayRoomInteractionActions;
  @ApiProperty()
  @ApiPropertyOptional()
  payload: GatewayRoomInteractionPayload;

}

export class GatewayRoomInteractionReq extends GatewayRoomInteractionRes {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}


export enum GatewayRoomControlActions {
  MUTE_SELF = 'MUTE_SELF', UNMUTE_SELF = 'UNMUTE_SELF', HOST_FORCE_MUTE = 'HOST_FORCE_MUTE', HOST_FORCE_UNMUTE = 'HOST_FORCE_UNMUTE', WHITE_BOARD_CONFIG = 'WHITE_BOARD_CONFIG'
}

export class GatewayRoomControlPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id?: string;
  sender?: User;
  white_board_config?: WhiteBoardConfig;
}


export class GatewayRoomControlRes {
  @ApiProperty({ enum: GatewayRoomControlActions })
  @IsNotEmpty()
  action: GatewayRoomControlActions;
  @ApiProperty()
  @IsNotEmptyObject()
  payload: GatewayRoomControlPayload;
}

export class GatewayRoomControlReq extends GatewayRoomControlRes {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}