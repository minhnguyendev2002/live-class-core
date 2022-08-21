import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TokenRole } from 'netless-token/src/index';
import { Attachment } from '@app/common-core/models/mongo/Message';
import User from '@app/common-core/entities/User.entity';

export type QueryList = {
  search: string;
  page: number;
  page_size: number;
}

export enum AgoraRtcRole {
  PUBLISHER = 1,
  SUBSCRIBER = 2,
}

export class AgoraTokenRequest {

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty()
  // uid: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  role: AgoraRtcRole;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  channel_name: string;
}

export class AgoraRoomRTCRequest {

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty({ description: 'default 0', default: 0 })
  // uid: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  room_id: number;
}

export class AgoraClassNetLessRequest {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  room_id: number;
}


export class AgoraRTM_TokenRequest {

  @IsNotEmpty()
  @ApiProperty()
  uid: number | string;
}

export type JoinRoomReq = {
  room_id: number;
}

export class AllowedRoomReq {
  @IsNotEmpty()
  @ApiProperty()
  room_id: number;
}

export class RoomAutoRollCallReq {
  @IsNotEmpty()
  @ApiProperty()
  room_id: number;
  @IsNotEmpty()
  @ApiProperty()
  is_auto_roll_call: boolean;
  @IsNotEmpty()
  @ApiProperty()
  auto_roll_call_every_minutes: number;
  user: User;
}

export class RoomRollCallReq {
  @ApiProperty()
  room_id: number;
  user: User;

  @ApiProperty({ type: [String] })
  attendant_user_ids: number[];

}

export class RoomVerifyRollCallReq {
  @IsNotEmpty()
  @ApiProperty()
  roll_call_id: number;

}

export class DeleteDocumentationReq {
  @ApiPropertyOptional()
  class_id: number;
  @ApiProperty()
  room_id: number;
  @ApiProperty()
  doc_id: number;
  @IsNotEmpty()
  @ApiProperty()
  is_delete_document: boolean;

}

export class RoomConversationsReq {
  @ApiProperty()
  room_id: number;
}

export class ClassConversationsReq {
  @ApiProperty()
  class_id: number;
}



