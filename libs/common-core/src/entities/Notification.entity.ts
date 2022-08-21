import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import User from '@app/common-core/entities/User.entity';

@Entity({ name: 'notifications' })
export default class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  @ApiProperty()
  class_id?: number;
  @Column()
  @ApiProperty()
  room_id?: number;
  @Column()
  @ApiProperty()
  user_id: number;
  @Column()
  @ApiProperty()
  source?: NotificationSource;
  @Column()
  @ApiProperty()
  action: NotificationAction;
  @Column({ type: 'json' })
  @ApiProperty()
  extra_data?: NotificationExtraData;
  @Column()
  @ApiProperty()
  enable?: boolean;
  @Column()
  @ApiProperty()
  read?: boolean;
  @UpdateDateColumn()
  @ApiProperty()
  updated_at?: Date;
  @CreateDateColumn()
  @ApiProperty()
  created_at?: Date;
}

export enum NotificationSource {
  PERSONAL = 'PERSONAL',
  ROOM = 'ROOM',
  CLASS = 'CLASS',
}

export enum NotificationAction {
  CLAP = 'CLAP',
  HAND_UP = 'HAND_UP',
  LOVE = 'LOVE',
  LIKE = 'LIKE',
  ANGRY = 'ANGRY',
  ROLL_CALL = 'ROLL_CALL',
  REQUEST_TURN_ON_MIC = 'REQUEST_TURN_ON_MIC',
  REQUEST_JOIN_ROOM = 'REQUEST_JOIN_ROOM',
  ACCEPT_JOIN_ROOM = 'ACCEPT_JOIN_ROOM',
  CANCEL_JOIN_ROOM = 'CANCEL_JOIN_ROOM',
  VERIFIED_ROLL_CODE = 'VERIFIED_ROLL_CODE',
  REQUEST_TURN_ON_CAMERA = 'REQUEST_TURN_ON_CAMERA',
  END_ROOM = 'END_ROOM',
  UNFOCUSED = 'UNFOCUSED',
}

export interface NotificationExtraData {
  room_id?: number;
  class_id?: number;
  checked?: boolean;
  sender?: User;
  roll_call_id?: number;
}

export class NotificationRoomReq {
  @ApiProperty()
  room_id: number;
  user_id: number;
  @ApiProperty({ enum: [NotificationAction.CLAP, NotificationAction.ANGRY, NotificationAction.LIKE, NotificationAction, NotificationAction.HAND_UP, NotificationAction.LOVE, NotificationAction.ROLL_CALL, NotificationAction.REQUEST_TURN_ON_CAMERA, NotificationAction.REQUEST_JOIN_ROOM, NotificationAction.REQUEST_TURN_ON_MIC] })
  action: NotificationAction;
}

export class NotificationRoomListQuery {
  @ApiProperty()
  room_id: number;
}

export class NotificationRoomHandDownReq {
  @ApiProperty()
  room_id: number;
  @ApiProperty()
  notification_ids: number[];
}

export enum NotificationRoomHandleRequestType {
  ACCEPT = 'ACCEPT',
  CANCEL = 'CANCEL',
}

export class NotificationRoomHandleRequestReq {
  @ApiProperty()
  id: number;
  @ApiProperty({ enum: [NotificationRoomHandleRequestType.ACCEPT, NotificationRoomHandleRequestType.CANCEL] })
  type: NotificationRoomHandleRequestType;
}

export class NotificationRead {
  @ApiProperty()
  id: number;
}


export class NotificationMultipleRead {
  @ApiProperty()
  @IsArray()
  ids: number[];
}
