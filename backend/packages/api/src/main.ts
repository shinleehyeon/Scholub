import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import packageJson from '@/../package.json';
import {
  applyBodyLimit,
  applyCors,
  applyGlobalEnhancements,
  applyHelmet,
  applyRedisFlush,
  applySwagger,
} from '@/app/lib';
import { getEnvironment } from './common/utils';

import '@common/lib/sentry/instrument';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');

  applyHelmet(app);

  applyBodyLimit(app, '1mb');

  applyCors(app, [configService.get<string>('CORS_ORIGIN') ?? '*']);

  applyGlobalEnhancements(app);

  applyRedisFlush(app);

  applySwagger(app);

  await app.listen(process.env.PORT ?? 8000, '0.0.0.0');

  logger.log(`Application version ${packageJson.version} is running on: ${await app.getUrl()}`);

  logger.debug(`Environment: ${getEnvironment()}`);
}

bootstrap();
