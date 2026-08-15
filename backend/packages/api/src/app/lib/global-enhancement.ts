import { GlobalExceptionFilter, PrismaExceptionFilter } from '@common/filters';
import { BigintInterceptor, TransformInterceptor } from '@common/interceptors';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';

export function applyGlobalEnhancements(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    transform:            true,
    whitelist:            true,
    forbidNonWhitelisted: true,
    transformOptions:     { enableImplicitConversion: false },
    exceptionFactory:     errors => {
      const detailedErrors = errors.map(error => ({
        field:   error.property,
        message: Object.values(error.constraints ?? {}).join(', '),
      }));

      const firstError = detailedErrors[0];

      const friendlyMessage = detailedErrors.length === 1
        ? `Please check the '${firstError.field}' field.`
        : 'Invalid input data. Please check all fields and try again.';

      return new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message:    friendlyMessage,
        errors:     detailedErrors,
      });
    },
  }));

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  app.useGlobalFilters(app.get(PrismaExceptionFilter));

  app.useGlobalInterceptors(new TransformInterceptor);

  app.useGlobalInterceptors(new BigintInterceptor);

  const isSentryEnabled = process.env.SENTRY_ENABLED === 'true';

  if (isSentryEnabled) {
    app.useGlobalFilters(new SentryGlobalFilter);
  }
}
