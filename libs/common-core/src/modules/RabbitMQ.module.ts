import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQProducerService } from '@app/common-core/providers/RabbitMQProducer.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath:'.env' }),
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RMQ_URL,
          ],
          queue: process.env.RMQ_QUEUE_NAME,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMQProducerService],
  exports: [RabbitMQProducerService],
})
export class RabbitMQModule {}