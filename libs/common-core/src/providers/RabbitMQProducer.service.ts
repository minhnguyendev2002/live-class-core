import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQProducerService {
  constructor(
    @Inject('rabbit-mq-module') private readonly client: ClientProxy,
  ) {
  }

  async send(pattern: string, data: any): Promise<string> {
    return new Promise<string>((resolve,reject) => {
      this.client.send(pattern, data).subscribe({
        next(value) {
          console.log('queue sent', value);
        },
        error(e){
          console.error(e);
          reject(e)
        },
        complete(){
          console.log('queue complete');
        }
      });
      resolve('ok');
    });
  }
}