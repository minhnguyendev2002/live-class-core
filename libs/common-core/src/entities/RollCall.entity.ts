import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomExtraData } from '@app/common-core/entities/Room.entity';

@Entity({ name: 'roll_calls' })
export default class RollCall {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;
  @ApiProperty()
  @Column()
  room_id: number;
  @ApiProperty()
  @Column()
  class_id: number;
  @ApiProperty()
  @Column()
  creator: number;
  @ApiProperty()
  @Column()
  user_id: number;
  @ApiProperty()
  @Column()
  requested_time: Date;
  @ApiProperty()
  @Column()
  checked_time?: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at?: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at?: Date;
}