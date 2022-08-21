import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiverService {
  getHello(): string {
    return 'Hello World!';
  }
}
