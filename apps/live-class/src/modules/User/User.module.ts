import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LessonAttachment from '@app/common-core/entities/LessonAttachment.entity';
import LessonAttachmentController from '../LessonAttachment/LessonAttachment.controller';
import { LessonAttachmentService } from '@app/common-core/providers/LessonAttachment.service';
import FileEntity from '@app/common-core/entities/File.entity';
import Folder from '@app/common-core/entities/Folder.entity';
import UserController from './User.controller';
import { FileStorageService } from '@app/common-core/providers/FileStorage.service';
import { UploadFileService } from '@app/common-core/providers/UploadFileService';
import User from '@app/common-core/entities/User.entity';
import { UserService } from '@app/common-core/providers/User.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  exports:[JwtModule],
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}