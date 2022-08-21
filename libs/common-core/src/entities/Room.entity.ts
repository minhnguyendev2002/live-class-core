import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Documentation from '@app/common-core/entities/Documentation.entity';
import { Conversation } from '@app/common-core/models/mongo/Conversation';

@Entity({ name: 'rooms' })
export default class Room {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  class_id: number;
  @ApiProperty()
  @Column()
  agora_room_uuid: string;
  @ApiProperty()
  @Column()
  nest_less_region: string;
  @ApiProperty()
  @Column()
  creator: number;
  @ApiProperty()
  @ApiProperty()
  @Column()
  started_at: Date;

  @ApiProperty()
  @Column()
  ended_at: Date;
  @ApiProperty()
  @Column({ type: 'json' })
  extra_data: RoomExtraData;


  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}

export class RoomDetail extends Room {
  docs: Documentation[];
  nano_id: string;
  conversation: {
    data: Conversation[],
    record_total: number
  };
}

export class CreateRoomRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  class_id: number;
  @ApiProperty()
  @ApiPropertyOptional()
  agora_room_uuid: string;
  @ApiProperty()
  @ApiPropertyOptional()
  nest_less_region: string;
  @ApiProperty()
  @ApiPropertyOptional()
  started_at: Date;

  @ApiPropertyOptional()
  extra_data: RoomExtraData;

  @ApiPropertyOptional()
  @ApiProperty()
  ended_at: Date;
}

export interface RoomExtraData {
  is_auto_roll_call?: boolean;
  auto_roll_call_every_minutes?: number;
  white_board_config?: WhiteBoardConfig;
}

export interface WhiteBoardConfig {
  board_color: string
}

export class WhiteBoardConfigReq {
  @ApiProperty()
  room_id: number;
  @ApiPropertyOptional()
  board_color: string;
}

export class UpdateRoomRequest {

  @IsNotEmpty()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  class_id: number;
  @ApiProperty()
  @ApiPropertyOptional()
  agora_room_uuid: string;
  @ApiProperty()
  @ApiPropertyOptional()
  nest_less_region: string;
  @ApiProperty()
  @ApiPropertyOptional()
  started_at: Date;

  @ApiPropertyOptional()
  extra_data: RoomExtraData;

  @ApiPropertyOptional()
  @ApiProperty()
  ended_at: Date;
}

export class ListQueryRooms {
  @ApiPropertyOptional()
  search: string;
  @ApiPropertyOptional({ description: 'default: 1' })
  page: number;
  @ApiPropertyOptional({ description: 'default: 20' })
  page_size: number;
  @ApiPropertyOptional({ description: 'default: id DESC (i.g: name ASC, created_at DESC)' })
  sort: string;

}
