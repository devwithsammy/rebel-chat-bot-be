import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping() {
    return {
      status: 'success',
      message: 'Server running',
    };
  }
}
