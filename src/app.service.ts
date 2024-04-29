import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return process.env.GIT_COMMIT || 'Hello World!';
  }
}
