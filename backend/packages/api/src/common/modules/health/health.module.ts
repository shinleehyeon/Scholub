import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '@/common/modules/prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule, RedisHealthModule, HttpModule, PrismaModule,
  ],
  controllers: [HealthController],
  providers:   [],
})
export class HealthModule {
}
