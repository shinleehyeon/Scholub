import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const isSentryEnabled = process.env.SENTRY_ENABLED === 'true';
const logger = new Logger('Sentry');

if (isSentryEnabled) {
  Sentry.init({
    dsn:              process.env.SENTRY_DSN,
    integrations:     [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
  });

  logger.log('Sentry initialized');
}
