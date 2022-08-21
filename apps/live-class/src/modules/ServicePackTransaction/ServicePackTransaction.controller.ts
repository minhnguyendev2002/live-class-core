import { Body, Controller, Get, Headers, HttpStatus, Post, Res } from '@nestjs/common';
import BaseController from '../../base.controller';
import { ServicePackService } from '@app/common-core/providers/ServicePack.service';
import { BaseResponse } from '../../utils/response.c';
import { Response } from 'express';
import { Endpoint, Fields } from '../../utils/constants';
import { ApiExcludeEndpoint, ApiHeader, ApiHideProperty, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ActivateTransaction,
  ConfirmTransaction,
  CreateServicePackTransaction,
  PayTransaction,
  ServicePackTransaction,
  ServicePackTransactionStatus,
} from '@app/common-core/entities/ServicePackTransaction.entity';
import { ServicePackTransactionService } from '@app/common-core/providers/ServicePackTransaction.service';
import { DefaultHeaders } from '../../utils/headers';

@ApiTags(Endpoint.ServicePackTransaction + ' (Quản lý giao dịch cho gói dịch vụ)')
@Controller(Endpoint.ServicePackTransaction)
export class ServicePackTransactionController extends BaseController {
  constructor(private readonly transactionService: ServicePackTransactionService, private readonly packService: ServicePackService) {
    super();
  }

  @Get(Endpoint.List)
  @ApiOperation({ summary: 'Danh sách' })
  async trans(@Headers() headers: DefaultHeaders): Promise<BaseResponse> {
    const response = this.successRes();
    const result = await this.transactionService.findById(parseInt(headers._id));
    response.data = result[0];
    response.total_record = result[1];
    return response;
  }

  @Post(Endpoint.TeacherBuying)
  @ApiOperation({ summary: 'Giaso viên mua gói' })
  async teacherCreateServicePack(@Headers() headers: DefaultHeaders, @Body() body: CreateServicePackTransaction, @Res() res: Response): Promise<BaseResponse> {
    const response = this.successRes();
    let create = body as ServicePackTransaction;
    create.creator = parseInt(headers._id);
    create.user_id = parseInt(headers._id);
    const pack = await this.packService.find_PUBLISHED_ById(create.service_pack_id);
    console.log('pack', pack);
    if (!pack || (pack && !pack.id)) {
      res.status(HttpStatus.BAD_REQUEST).json(this.badRequestRes('Service Pack invalid, serve for Only PUBLISHED status'));
      return;
    }
    console.log('pack', pack);
    create.class_number = pack.class_number;
    create.day_number = pack.day_number;
    create.teaching_time_number = pack.teaching_time_number;
    create.total_amount_due = pack.price;
    response.data = await this.transactionService.create(create);
    res.json(response);
  }

  @Post(Endpoint.TransConfirm)
  @ApiOperation({ summary: 'Xác nhận gói dịch vụ' })
  async confirmTrans(@Headers() headers: DefaultHeaders, @Body() body: ConfirmTransaction, @Res() res: Response): Promise<BaseResponse> {
    const response = this.successRes();
    const trans = await this.transactionService.find_INITIATED_TransById(body.id);
    if (!trans || (trans && !trans.id)) {
      res.status(HttpStatus.BAD_REQUEST).json(this.badRequestRes('INITIATED Transaction not found'));
      return;
    }
    const affected = await this.transactionService.confirmTrans(trans.id);
    if (!affected) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.internalServerErrorRes('Cannot change the status'));
      return;
    }
    trans.status = ServicePackTransactionStatus.CONFIRMED;
    response.data = trans;
    res.json(response);
  }

  @Post(Endpoint.TransPayment)
  @ApiOperation({ summary: 'Xác nhận thanh toán' })
  async payTrans(@Headers() headers: DefaultHeaders, @Body() body: PayTransaction, @Res() res: Response): Promise<BaseResponse> {
    const response = this.successRes();
    if (body.otp !== '123') {
      res.status(HttpStatus.BAD_REQUEST).json(this.badRequestRes('Wrong OTP'));
      return;
    }
    const trans = await this.transactionService.findOneById(body.id);
    if (!trans || (trans && !trans.id)) {
      res.status(HttpStatus.BAD_REQUEST).json(this.badRequestRes('the transaction not found'));
      return;
    } else {
      if (trans.status === ServicePackTransactionStatus.CONFIRMED || trans.status === ServicePackTransactionStatus.RECONCILED) {
        const affected = await this.transactionService.payTrans(trans.id);
        if (!affected) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.internalServerErrorRes('Cannot change status'));
          return;
        }
        trans.status = ServicePackTransactionStatus.PAID;
        response.data = trans;
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(this.notAcceptableRes('the transaction status must be CONFIRMED or RECONCILED'));
        return;
      }
    }

    res.json(response);
  }

  @ApiOperation({ summary: 'Kích hoạt gói cước' })
  @Post(Endpoint.TransActivate)
  async activateTrans(@Headers() headers: DefaultHeaders, @Body() body: ActivateTransaction, @Res() res: Response): Promise<BaseResponse> {
    const response = this.successRes();
    const trans = await this.transactionService.find_PAID_ById(body.id);
    if (!trans || (trans && !trans.id)) {
      res.status(HttpStatus.BAD_GATEWAY);
      res.status(HttpStatus.BAD_REQUEST).json(this.badRequestRes('the transaction not fount'));
      return;
    } else {
      const newTrans = await this.transactionService.activateTrans(trans);
      if (!newTrans) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.internalServerErrorRes('Cannot change status'));
        return;
      }
      response.data = newTrans;
    }


    res.json(response);
  }


}
