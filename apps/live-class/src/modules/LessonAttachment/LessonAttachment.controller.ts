import { Body, Controller, Delete, Get, Post, Query,Headers } from '@nestjs/common';
import BaseController from '../../base.controller';
import { QueryList } from '../../utils/request';
import { BaseResponse } from '../../utils/response.c';
import { LessonAttachmentService } from '@app/common-core/providers/LessonAttachment.service';
import LessonAttachment, {
  CreateLessonAttachment,
  UpdateLessonAttachment,
} from '../../../../../libs/common-core/src/entities/LessonAttachment.entity';
import { Endpoint } from '../../utils/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicePackHeader } from '../../utils/headers';

@ApiTags(Endpoint.LessonAttachment)
@ApiBearerAuth()
@Controller(Endpoint.LessonAttachment)
export default class LessonAttachmentController extends BaseController {


  constructor(private readonly lessonAttachmentService: LessonAttachmentService) {
    super();
  }

  @Get(Endpoint.List)
  async getList(@Query() query: QueryList): Promise<BaseResponse> {
    const response = this.successRes();
    const list = await this.lessonAttachmentService.getList(query);
    response.total_record = list[1];
    response.data = list[0];
    return response;
  }

  @Post()
  async create(@Body() body: CreateLessonAttachment): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.lessonAttachmentService.create(body as LessonAttachment);
    return response;
  }

  @Post()
  async update(@Body() body: UpdateLessonAttachment): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.lessonAttachmentService.update(body as LessonAttachment);
    return response;
  }


  @Delete()
  async delete(@Query('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.lessonAttachmentService.delete(id);
    return response;
  }

}