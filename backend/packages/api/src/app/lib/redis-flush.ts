import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/common/modules/redis';
import { isLocal } from '@/common/utils';

export function applyRedisFlush(app: INestApplication) {
  const logger = new Logger('Redis');
  const isRedisFlush = isLocal() && app.get(ConfigService).get<string>('REDIS_FLUSH_ON_START') === 'true';

  if (isRedisFlush) {
    const redisService = app.get(RedisService);

    redisService.flushdb();

    logger.warn('Redis flushed before starting the application');
  }
}
