import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UploadResponseData } from '@app/common-core/models/UploadReponse';
import Folder from '@app/common-core/entities/Folder.entity';

@Entity({ name: 'files' })
export default class FileEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  @ApiProperty()
  name: string;
  @Column()
  @ApiProperty()
  creator?: string;
  @Column()
  @ApiProperty()
  size: number;
  @Column()
  @ApiProperty()
  type: string;
  @Column()
  @ApiProperty()
  width?: number;
  @Column()
  @ApiProperty()
  height?: number;
  @Column()
  @ApiProperty()
  preview_url?: string;
  @Column()
  @ApiProperty()
  url: string;
  @Column()
  @ApiProperty()
  folder_id?: number;
  @Column({type:'json'})
  @ApiProperty()
  extra_data: UploadResponseData;
  @UpdateDateColumn()
  @ApiProperty()
  updated_at?: Date;
  @CreateDateColumn()
  @ApiProperty()
  created_at?: Date;
}


export class DeleteFile {
  @ApiProperty()
  id: number;
}

export class StorageContentReq {
  @ApiPropertyOptional()
  folder_id: number;
  @ApiPropertyOptional()
  page: number;
  @ApiPropertyOptional()
  page_size: number;

}

export class StorageContentResponse {
  files: FileEntity[];
  folders: Folder[];
}