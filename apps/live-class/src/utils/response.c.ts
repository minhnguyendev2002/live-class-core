import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { constants } from 'http2';


export enum HttpMessage {
  Success = 'Success',
  Unauthorized = 'Unauthorized',
  NotAcceptable = 'NotAcceptable',
  InternalServerError = 'InternalServerError',
  BadRequest = 'BadRequest',
}

export type BaseResponse = {
  status: number;
  message: string;
  data?: any;
  total_record?: number;
};

export const SuccessRes = (message?: string): BaseResponse => {
  return {
    status: HttpStatus.OK,
    message: message ? message : HttpMessage.Success,
  };
};

export const UnauthorizedRes = (message?: string): BaseResponse => {
  return {
    status: HttpStatus.UNAUTHORIZED,
    message: message ? message : HttpMessage.Unauthorized,
  };
};

export const NotAcceptableRes = (message?: string): BaseResponse => {
  return {
    status: HttpStatus.NOT_ACCEPTABLE,
    message: message ? message : HttpMessage.NotAcceptable,
  };
};

export const BadRequestRes = (message?: string): BaseResponse => {
  return {
    status: HttpStatus.BAD_REQUEST,
    message: message ? message : HttpMessage.BadRequest,
  };
};

export const InternalServerErrorRes = (message?: string): BaseResponse => {
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: message ? message : HttpMessage.InternalServerError,
  };
};


