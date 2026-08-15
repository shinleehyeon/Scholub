import { Temporal } from '@js-temporal/polyfill';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigintInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => this.serializeBigInt(data)));
  }

  private serializeBigInt(value: unknown): unknown {
    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value instanceof Temporal.Instant) {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map(item => this.serializeBigInt(item));
    }

    if (value !== null && typeof value === 'object') {
      const result: Record<string, unknown> = {};

      for (const [key, val] of Object.entries(value)) {
        result[key] = this.serializeBigInt(val);
      }

      return result;
    }

    return value;
  }
}
