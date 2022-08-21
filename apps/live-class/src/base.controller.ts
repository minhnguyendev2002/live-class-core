import { BadRequestRes, BaseResponse, InternalServerErrorRes, NotAcceptableRes, SuccessRes } from './utils/response.c';

export default class BaseController {
  successRes = SuccessRes;
  badRequestRes = BadRequestRes;
  internalServerErrorRes = InternalServerErrorRes;
  notAcceptableRes = NotAcceptableRes;
}
