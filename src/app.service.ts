import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'server working :) https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}
