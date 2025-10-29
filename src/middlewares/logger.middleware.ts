import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    // dont log in production
    const environment = this.configService.get<string>('NODE_ENV') || '';
    if (environment === 'production') {
      return next();
    }
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
