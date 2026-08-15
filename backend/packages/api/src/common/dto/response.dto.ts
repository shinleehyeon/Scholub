import { HttpStatus } from '@nestjs/common';
import { DataClass } from 'dataclasses';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export class APIResponseDto<T = unknown> extends DataClass {
  status:    HttpStatus;
  method:    HttpMethod;
  instance:  string;
  details:   string;
  data:      T | null;
  errors:    unknown | null;
  timestamp: string;
}
