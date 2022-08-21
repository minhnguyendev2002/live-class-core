import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import User, { UserRole } from '@app/common-core/entities/User.entity';

@Injectable()
export class UserRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("_user_data",req.headers._user_data)
    if (req.headers._verified_role && req.headers._verified_role === 'true') {
      return next();
    }else {
      req.headers._verified_role = 'false';
      try {
        console.log("_user_data",req.headers._user_data)
        if (req.headers._user_data) {
          const user = JSON.parse(req.headers._user_data + '') as User;
          if (user.role==UserRole.USER) {
            req.headers._verified_role = 'true';
          }
        }
      } catch (e) {
        console.error(e);
      }
      return next();
    }

  }
}
