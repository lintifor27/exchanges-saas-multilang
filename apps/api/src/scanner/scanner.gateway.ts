import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable } from 'rxjs';
import Redis from 'ioredis';

@Injectable()
export class ScannerGateway implements OnModuleInit, OnModuleDestroy {
  private redisSub: Redis;
  private channels = ['opportunity:cex', 'opportunity:tri', 'opportunity:p2p'];
  private subjects: Record<string, Subject<any>> = {};

  constructor(private readonly config: ConfigService) {
    this.channels.forEach((channel) => {
      this.subjects[channel] = new Subject<any>();
    });
  }

  onModuleInit() {
    const host = this.config.get<string>('REDIS_HOST', 'localhost');
    const port = this.config.get<number>('REDIS_PORT', 6379);
    this.redisSub = new Redis({ host, port });
    this.redisSub.subscribe(...this.channels, (err) => {
      if (err) console.error('Redis subscribe error', err);
    });
    this.redisSub.on('message', (channel, message) => {
      try {
        const data = JSON.parse(message);
        this.subjects[channel].next(data);
      } catch (e) {
        console.error('Error parsing message', e);
      }
    });
  }

  onModuleDestroy() {
    this.redisSub?.disconnect();
  }

  /**
   * Returns an observable stream for a given opportunity type.
   * type: 'cex' | 'tri' | 'p2p'
   */
  getStream(type: string): Observable<any> {
    const channel = `opportunity:${type}`;
    const subject = this.subjects[channel];
    return subject.asObservable();
  }
}