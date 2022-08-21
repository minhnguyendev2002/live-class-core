import BaseController from '../../base.controller';
import { Body, Controller, Delete, Get, Post, Put, Query, Headers } from '@nestjs/common';
import { BaseResponse } from '../../utils/response.c';
import { QueryList } from '../../utils/request';
import { ClassService } from '@app/common-core/providers/Class.service';
import Class, { TeacherCreateClass, UpdateClass } from '../../../../../libs/common-core/src/entities/Class.entity';
import { createApiPropertyDecorator } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../../utils/constants';
import { DefaultHeaders, ServicePackHeader } from '../../utils/headers';
import { ServicePackTransaction } from '@app/common-core/entities/ServicePackTransaction.entity';

@ApiTags(Endpoint.Class)
@ApiBearerAuth()
@Controller(Endpoint.Class)
export default class ClassController extends BaseController {

  constructor(private readonly classService: ClassService) {
    super();
  }

  @Get(Endpoint.List)
  async getList(@Query() query: QueryList): Promise<BaseResponse> {
    const response = this.successRes();
    const list = await this.classService.getList(query);
    response.total_record = list[1];
    response.data = list[0];
    return response;
  }

  @Post(Endpoint.ClassTeacherCreate)
  async teacherCreate(@Headers() headers: ServicePackHeader, @Body() body: TeacherCreateClass): Promise<BaseResponse> {
    const response = this.successRes();
    const create = body as Class;
    create.creator =parseInt(headers._id);
    create.host = parseInt(headers._id);
    const trans =JSON.parse(headers.extra_data) as ServicePackTransaction
    if (!create.attendant_number || create.attendant_number > trans.attendant_number || create.attendant_number === 0) {
      create.attendant_number = trans.attendant_number;
    }
    response.data = await this.classService.create(create);
    return response;
  }

  @Put()
  async update(@Body() body: UpdateClass): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.classService.update(body as Class);
    return response;
  }


  @Delete()
  async delete(@Query('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.classService.delete(id);
    return response;
  }

}