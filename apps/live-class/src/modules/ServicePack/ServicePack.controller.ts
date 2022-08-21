import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import BaseController from '../../base.controller';
import { ServicePackService } from '../../../../../libs/common-core/src/providers/ServicePack.service';
import { BaseResponse } from '../../utils/response.c';
import {
  CreateServicePack, ListQueryBuyingServicePack,
  ListQueryServicePack,
  ServicePack,
  ServicePackStatus,
  UpdateServicePack, UpdateServicePackStatus
} from '@app/common-core/entities/ServicePack.entity';
import { Endpoint } from '../../utils/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DefaultHeaders } from '../../utils/headers';

@ApiTags(Endpoint.ServicePack + ' (Quản lý gói dịch vụ)')
@ApiBearerAuth()
@Controller(Endpoint.ServicePack)
export class ServicePackController extends BaseController {
  constructor(private readonly servicePackService: ServicePackService) {
    super();
  }

  @Get(Endpoint.List)
  async getList(@Query() query: ListQueryServicePack): Promise<BaseResponse> {
    const response = this.successRes();
    query.page=query.page?parseInt(query.page+""):0
    query.page_size=query.page_size?parseInt(query.page_size+""):20
    const list = await this.servicePackService.getItemJoinList(query);
    response.total_record = list[1];
    response.data = list[0];
    return response;
  }

  @Get(':id/detail')
  async get(@Param('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    const data = await this.servicePackService.findOneById(id);
    if (data){
      response.data=data;
    }else {
      return this.badRequestRes('service pack invalid')
    }
    return response;
  }

  @Get(Endpoint.ServicePackBuyingList)
  async getBuyingList(@Query() query: ListQueryBuyingServicePack): Promise<BaseResponse> {
    query.page=query.page?parseInt(query.page+""):0
    query.page_size=query.page_size?parseInt(query.page_size+""):20
    const response = this.successRes();
    if (!query.page) {
      query.page = 1;
    }
    if (!query.page_size) {
      query.page_size = 20;
    }
    const list = await this.servicePackService.getBuyingList(query);
    response.total_record = list[1];
    response.data = list[0];
    return response;
  }

  @Post()
  async create(@Headers() headers: DefaultHeaders, @Body() create: CreateServicePack): Promise<BaseResponse> {
    const response = this.successRes();
    create.creator = parseInt(headers._id);
    response.data = await this.servicePackService.createServicePack(
      create as ServicePack
    );
    return response;
  }

  @Put()
  async update(@Body() create: UpdateServicePack): Promise<BaseResponse> {
    const response = this.successRes();
    response.data = await this.servicePackService.updateServicePack(
      create as ServicePack
    );
    return response;
  }

  @Put(Endpoint.ServicePackStatus)
  async updateStatus(@Body() update: UpdateServicePackStatus): Promise<BaseResponse> {
    const response = this.successRes();
    await this.servicePackService.updateStatus(update);
    return response;
  }

  @Delete()
  async delete(@Query('id') id: number): Promise<BaseResponse> {
    const response = this.successRes();
    if (!id) {
      return this.badRequestRes('id required');
    }
    await this.servicePackService.deleteServicePack(id);
    return response;
  }

}
