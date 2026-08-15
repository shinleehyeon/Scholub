import { JwtAuthGuard } from '@modules/user/infrastructure/guards';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { GlobalExceptionFilter, PrismaExceptionFilter } from '@/common/filters';
import { HealthModule } from '@/common/modules/health';
import { AppController } from './app.controller';
import { DatabaseModule, FeatureModule } from './integration';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    FeatureModule,
    HealthModule,
    CacheModule.registerAsync({
      imports:    [ConfigModule],
      isGlobal:   true,
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (!redisUrl) {
          return { ttl: 60000 };
        }

        const Keyv = (await import('keyv')).default;
        const KeyvRedis = (await import('@keyv/redis')).default;

        return { store: new Keyv({ store: new KeyvRedis(redisUrl) }) };
      },
      inject: [ConfigService],
    }),
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers:   [
    GlobalExceptionFilter,
    PrismaExceptionFilter,
    {
      provide:  APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
}
