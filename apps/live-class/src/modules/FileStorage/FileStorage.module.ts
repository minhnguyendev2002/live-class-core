import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LessonAttachment from '@app/common-core/entities/LessonAttachment.entity';
import LessonAttachmentController from '../LessonAttachment/LessonAttachment.controller';
import { LessonAttachmentService } from '@app/common-core/providers/LessonAttachment.service';
import FileEntity from '@app/common-core/entities/File.entity';
import Folder from '@app/common-core/entities/Folder.entity';
import FileStorageController from './FileStorage.controller';
import { FileStorageService } from '@app/common-core/providers/FileStorage.service';
import { UploadFileService } from '@app/common-core/providers/UploadFileService';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, Folder])],
  controllers: [FileStorageController],
  providers: [FileStorageService,UploadFileService],
})
export class FileStorageModule {
}