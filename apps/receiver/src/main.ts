import { NestFactory } from '@nestjs/core';
import { ReceiverModule } from './receiver.module';
import { RedisIoAdapter } from './RedisIoAdapter';
import { AppModule } from '../../live-class/src/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ReceiverModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.RMQ_URL,
      ],
      queue: process.env.RMQ_QUEUE_NAME,
      // false = manual acknowledgement; true = automatic acknowledgment
      noAck: false,
      // Get one by one
      prefetchCount: 10
    }
  });
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.listen()
}

bootstrap().then();
