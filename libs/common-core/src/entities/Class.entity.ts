import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'classes' })
export default class Class {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column()
  creator: number;
  @ApiProperty()
  @Column()
  @ApiProperty()
  @Column()
  host: number;
  @ApiProperty()
  @Column()
  password: string;
  @ApiProperty()
  @Column()
  attendant_number: number;
  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}

export class TeacherCreateClass {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @ApiProperty()
  @ApiPropertyOptional()
  description: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @Column()
  attendant_number: number;
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class UpdateClass {
  @IsNotEmpty()
  @ApiProperty()
  id: number;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  creator: number;

  @IsNotEmpty()
  @ApiProperty()
  host: number;
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @ApiProperty()
  attendant_number: number;
}