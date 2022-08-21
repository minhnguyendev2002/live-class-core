import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { UnauthorizedRes } from '../utils/response.c';
import User from '@app/common-core/entities/User.entity';

@Injectable()
export class JWTMiddleware implements NestMiddleware {

  constructor(private jwtService: JwtService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const user = await this.jwtService.verifyAsync<User>(token, { secret: process.env.JWT_SECRET_KEY });
        if (user) {
          req.headers._id = user.id+"";
          req.headers._role = user.role;
          req.headers._user_data = JSON.stringify(user);
          req.headers._token = token;
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json(UnauthorizedRes());
        }
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json(UnauthorizedRes());
      }
      return next();
    } catch (e) {
      console.error(e);
      return res.status(HttpStatus.UNAUTHORIZED).json(UnauthorizedRes());
    }

  }
}
