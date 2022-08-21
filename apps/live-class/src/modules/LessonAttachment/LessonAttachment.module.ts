import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LessonAttachmentController from './LessonAttachment.controller';
import { LessonAttachmentService } from '../../../../../libs/common-core/src/providers/LessonAttachment.service';
import LessonAttachment from '../../../../../libs/common-core/src/entities/LessonAttachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonAttachment])],
  controllers: [LessonAttachmentController],
  providers: [LessonAttachmentService],
})
export class LessonAttachmentModule {
}