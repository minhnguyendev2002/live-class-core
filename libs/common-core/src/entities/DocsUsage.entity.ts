import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomExtraData } from '@app/common-core/entities/Room.entity';

@Entity({ name: 'docs_usage' })
export default class DocsUsage {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;
  @ApiProperty()
  @Column()
  room_id: number;
  @ApiProperty()
  @Column()
  doc_id: number;
  @ApiProperty()
  @Column()
  class_id?: number;

  @ApiProperty()
  @Column()
  pointer?: string;


  @ApiProperty()
  @UpdateDateColumn()
  updated_at?: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at?: Date;
}


