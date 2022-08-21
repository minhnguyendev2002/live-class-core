import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'classes' })
export default class LessonAttachment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
	id: number;
  @Column()
  @ApiProperty()
	class_id: number;
  @Column()
  @ApiProperty()
	timetable_id: number;
  @Column()
  @ApiProperty()
  creator: number;
  @Column()
  @ApiProperty()
  url: string;
  @UpdateDateColumn()
  @ApiProperty()
	updated_at: Date;
  @CreateDateColumn()
  @ApiProperty()
	created_at: Date;
}

export class CreateLessonAttachment {
  @IsNotEmpty()
  @ApiProperty()
  class_id: number;
  @IsNotEmpty()
  @ApiProperty()
  timetable_id: number;
  @IsNotEmpty()
  @ApiProperty()
  creator: number;
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}

export class UpdateLessonAttachment {
  @IsNotEmpty()
  @ApiProperty()
  id: number;
  @IsNotEmpty()
  @ApiProperty()
  class_id: number;
  @IsNotEmpty()
  @ApiProperty()
  timetable_id: number;
  @IsNotEmpty()
  @ApiProperty()
  creator: number;
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}