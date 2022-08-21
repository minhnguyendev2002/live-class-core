import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import User from '@app/common-core/entities/User.entity';

export enum AttendanceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

@Entity({ name: 'attendance' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  class_id?: number;
  @Column()
  room_id: number;
  @Column()
  user_id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  phone_number: string;
  @Column()
  full_name: string;
  @Column({ type: 'json' })
  user_data: User;
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.OFFLINE
  })
  status: AttendanceStatus;
  @Column()
  updated_at?: Date;
  @Column()
  created_at?: Date;
}

export interface UserData {

}