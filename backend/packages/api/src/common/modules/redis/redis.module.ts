import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    ConfigModule,
    NestRedisModule.forRootAsync({
      imports:    [ConfigModule],
      useFactory: (configService: ConfigService) => ({ config: {
        url:                  configService.get<string>('REDIS_URL') as string,
        maxRetriesPerRequest: 3,
        enableReadyCheck:     false,
        connectTimeout:       1000,
        lazyConnect:          true,
      } }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports:   [RedisService],
})
export class RedisModule {
}
