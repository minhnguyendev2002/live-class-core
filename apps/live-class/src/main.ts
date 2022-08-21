import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, LogLevel, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { BadRequestRes } from './utils/response.c';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { MulterModule } from '@nestjs/platform-express';

const mLogger: LoggerService = {
  debug(message: any, ...optionalParams: any[]): any {
    console.debug('message', message);
    console.debug('optionalParams', optionalParams);
    return message;
  },
  error(message: any, ...optionalParams: any[]): any {
    console.error('message', message);
    console.error('optionalParams', optionalParams);
    return message;
  },
  log(message: any, ...optionalParams: any[]): any {
    console.log(message);
    console.log(optionalParams);
    return message;
  },
  setLogLevels(levels: LogLevel[]): any {
    console.log('setLogLevels', levels);
    return levels;
  },
  verbose(message: any, ...optionalParams: any[]): any {
    console.log('message', message);
    console.log('optionalParams', optionalParams);
    return message;
  },
  warn(message: any, ...optionalParams: any[]): any {
    console.warn(message);
    console.warn(optionalParams);
    return message;
  },
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    cors:{
      origin:'*',
      methods:'*'
    }
  });
  const config = new DocumentBuilder()
    .setTitle('Live Class')
    .setDescription('The Live Class API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const badRequest = BadRequestRes();
        badRequest.data = validationErrors.map(
          (validationError: ValidationError) => {
            let validation = '';
            Object.keys(validationError.constraints).forEach(function (
              key,
              index,
            ) {
              validation = validationError.constraints[key];
            });
            return {
              field: validationError.property,
              validation: validation,
            };
          },
        );
        return new BadRequestException(badRequest);
      },
    }),
  );
  await app.listen(process.env.LISTEN_PORT);
}

bootstrap().then();
