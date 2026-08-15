import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIResponseDto, HttpMethod } from '@/common/dto/response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(map((data: unknown) => {
      if (data && typeof data === 'object' && 'status' in data && 'method' in data) {
        return data;
      }

      return APIResponseDto.from({
        status:   response.statusCode,
        method:   request.method as HttpMethod,
        instance: request.url,
        details:  'Success',
        data,
        errors:   null,
      });
    }));
  }
}
