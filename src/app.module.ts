import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from './conversation/conversation.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import Joi from 'joi';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 1 minute
        limit: 100, // 100 requests per minute per IP
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'production', 'preproduction'),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    AuthModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
