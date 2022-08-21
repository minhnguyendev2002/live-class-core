import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../../utils/constants';
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import BaseController from '../../base.controller';
import { DefaultHeaders } from '../../utils/headers';
import { Util } from '@app/common-core/util/Util';
import { UserService } from '@app/common-core/providers/User.service';
import User, { UserQuickRegisterReq } from '@app/common-core/entities/User.entity';
import { JwtService } from '@nestjs/jwt';

@ApiTags(Endpoint.User)
@ApiBearerAuth()
@Controller(Endpoint.User)
export default class UserController extends BaseController {

  constructor(private readonly userService: UserService, private jwtService: JwtService) {
    super();

  }

  @Post(Endpoint.UserQuickRegister)
  async createFolder(@Headers() headers: DefaultHeaders, @Body() body: UserQuickRegisterReq) {
    const response = this.successRes();
    const create: User = {
      role: body.role,
      full_name: body.full_name,
      username: Util.removeVietnamese(body.full_name).replace(/\s/g, ''),
    };
    const data = await this.userService.create(create);
    data.token = await this.jwtService.signAsync(data, { secret: process.env.JWT_SECRET_KEY, expiresIn: '90 days' });
    response.data = data;
    return response;
  }

  @Get(Endpoint.UserInfo)
  async info(@Headers() headers: DefaultHeaders) {
    const response = this.successRes();
    response.data = await this.userService.findOneById(parseInt(headers._id));
    return response;
  }


}