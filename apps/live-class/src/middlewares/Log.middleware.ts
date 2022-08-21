import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("request headers",req.headers)
    console.log("request body",req.body)
    console.log("request query",req.query)
    console.log("request params",req.params)
    console.log("request method",req.method)
    const ip = (req.headers['x-forwarded-for'] || '') ||
      req.socket.remoteAddress
    console.log("request ip",ip)
    console.log("request url",req.protocol+"://"+req.hostname+req.url)
    next();
  }
}
