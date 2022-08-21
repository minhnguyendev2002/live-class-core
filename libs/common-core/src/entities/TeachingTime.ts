import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'teaching_times' })
export class TeachingTime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  class_id: number;
  @ApiProperty()
  @Column()
  host: number;
  @ApiProperty()
  @Column()
  school_id: number;
  @ApiProperty()
  @Column()
  started_at: Date;
  @ApiProperty()
  @Column()
  ended_at: Date;
  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  @Column()
  creator: number;

}



