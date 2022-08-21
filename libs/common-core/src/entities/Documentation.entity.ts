import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'documentations' })
export default class Documentation {
  @PrimaryGeneratedColumn()
  @ApiPropertyOptional()
  id?: number;
  @Column()
  creator: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiPropertyOptional()
  @Column()
  description?: string;

  @ApiProperty()
  @Column({ type: 'json' })
  data?: DocumentationExtraData[];

  @UpdateDateColumn()
  updated_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}

export class DocumentationUpdate {
  @ApiProperty()
  id: number;
  creator: number;
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  @Column({ type: 'json' })
  data?: DocumentationExtraData[];

}

export interface DocumentationExtraData {
  id: string;
  title: string;
  description: string;
  attachments: DocumentAttachment[];
  exercise: string[]
  data: DocumentationExtraData[]
}

export enum DocumentAttachmentType {
  IMAGE = 'image',
  PDF = 'pdf',
  AUDIO = 'audio',
  VIDEO = 'video',
  DOCS = 'docs',
}

export interface DocumentAttachment {
  type: DocumentAttachmentType;
  url: string;
  name: string;
  id: string;
}

export class CreateDocumentationReq {
  @ApiPropertyOptional()
  class_id?: number;
  @ApiPropertyOptional()
  room_id?: number;

  @ApiProperty()
  documentation: Documentation;

}