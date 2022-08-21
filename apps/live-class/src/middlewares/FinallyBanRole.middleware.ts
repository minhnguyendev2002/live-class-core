import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { UnauthorizedRes } from '../utils/response.c';

@Injectable()
export class FinallyBanRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers._verified_role && req.headers._verified_role === 'true') {
      return next();
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(UnauthorizedRes('permission denied'));
    }
  }
}
