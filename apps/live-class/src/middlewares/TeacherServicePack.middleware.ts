import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ServicePackTransactionService } from '@app/common-core/providers/ServicePackTransaction.service';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { NotAcceptableRes } from '../utils/response.c';

@Injectable()
export class TeacherServicePackMiddleware implements NestMiddleware {
  constructor(private transactionService: ServicePackTransactionService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers._id){
        const id = req.headers._id as string;
        const trans = await this.transactionService.find_ACTIVATED_valid_ByUserId(id);
        if (trans) {
          req.headers.extra_data = JSON.stringify(trans);
          next();
        } else {
          const notAcceptable = NotAcceptableRes('your service invalid');
          res.status(HttpStatus.NOT_ACCEPTABLE).json(notAcceptable);
        }
      }else {
        next();
      }
    }catch (e){
      console.log("test ba")
      console.error(e)
      next()
    }

  }
}
