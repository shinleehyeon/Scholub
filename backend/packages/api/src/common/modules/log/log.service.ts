import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LogService implements LoggerService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService) {
  }

  log(message: string, ...context: string[]) {
    this.logger.log(message, `${context.join(' ')}`);
  }

  error(message: string, trace?: string, ...context: string[]) {
    this.logger.error(message, trace, `${context.join(' ')}`);
  }

  warn(message: string, ...context: string[]) {
    this.logger.warn(message, `${context.join(', ')}`);
  }

  debug(message: string, ...context: string[]) {
    this.logger.debug?.(message, `${context.join(' ')}`);
  }

  verbose(message: string, ...context: string[]) {
    this.logger.verbose?.(message, `${context.join(' ')}`);
  }
}
