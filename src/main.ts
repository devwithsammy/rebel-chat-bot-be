import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { NextFunction, Request, Response } from 'express';
import express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const configService = app.get(ConfigService);
  const logger = new Logger('APP-START');

  app.use(express.json());
  //   security middleware
  app.use(((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);

    if (req.query) {
      for (const key in req.query) {
        if (key.startsWith('$')) {
          console.warn(`Sanitized query key: ${key}`);
          delete req.query[key];
        }
      }
    }

    next();
  }) as (req: Request, res: Response, next: NextFunction) => void);

  app.use(helmet());
  app.use(helmet.hidePoweredBy()); // Hide NestJS signature

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints || {});
          return acc;
        }, {});
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  const allowedOrigins: string[] =
    (configService.get<string>('CORS_ORIGINS')?.split(',') as string[]) || [];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  logger.log(`Server started at port ${PORT} ✅`);
}
bootstrap();
