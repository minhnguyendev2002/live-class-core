import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'folders' })
export default class Folder {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @ApiProperty()
  name: string;
  @Column()
  @ApiProperty()
  description?: string;
  @Column()
  @ApiProperty()
  creator: number;
  @Column()
  @ApiProperty()
  parent_id?: number;
  @UpdateDateColumn()
  @ApiProperty()
  updated_at?: Date;
  @CreateDateColumn()
  @ApiProperty()
  created_at?: Date;
}

export class CreateFolderReq {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  parent_id: number;
}

export class UpdateFolderReq {
  @ApiPropertyOptional()
  name: string;
  @ApiProperty()
  id: number;
  @ApiPropertyOptional()
  description: string;
}

export class DeleteFolder {
  @Column()
  @ApiProperty()
  id: number;
}