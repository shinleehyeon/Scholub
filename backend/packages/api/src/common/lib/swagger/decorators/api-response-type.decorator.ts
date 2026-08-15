/* eslint-disable */
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

type PrimitiveType = 'string' | 'boolean' | 'number';
type ClassType<T = any> = new (...args: any[]) => T;

interface ApiResponseTypeOptions<T = unknown> {
  type: PrimitiveType | ClassType<T>;
  description?: string;
  isArray?: boolean;
  errors?: number[];
  status?: number;
}

export function ApiResponseType<T>(options: ApiResponseTypeOptions<T>) {
  const { type, description = 'Success', isArray = false, errors = [], status = 200 } = options;
  const isPrimitive = typeof type === 'string';
  const decorators: Array<MethodDecorator & ClassDecorator> = [];

  const dataSchema = isPrimitive
    ? (isArray ? { type: 'array', items: { type } } : { type })
    : (isArray ? { type: 'array', items: { $ref: getSchemaPath(type as ClassType<T>) } } : { $ref: getSchemaPath(type as ClassType<T>) });

  decorators.push(ApiResponse({
    status: status,
    description,
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: status },
        method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'] },
        instance: { type: 'string', example: '/api/auth/login' },
        details: { type: 'string', example: 'Success' },
        data: dataSchema,
        errors: { type: 'object', nullable: true },
        timestamp: { type: 'string', example: '2025-10-12T02:54:44.123Z' },
      },
      required: ['status', 'method', 'instance', 'details', 'data', 'timestamp'],
    },
  }));

  const errorMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  };

  errors.forEach(statusCode => {
    decorators.push(ApiResponse({
      status: statusCode,
      description: errorMessages[statusCode] || 'Error',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'number', example: statusCode },
          method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'] },
          instance: { type: 'string', example: '/api/auth/login' },
          details: { type: 'string', example: errorMessages[statusCode] || 'Error' },
          data: { type: 'null' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
            nullable: true,
          },
          timestamp: { type: 'string', example: '2025-10-12T02:54:44.123Z' },
        },
        required: ['status', 'method', 'instance', 'details', 'data', 'timestamp'],
      },
    }));
  });

  if (!isPrimitive) {
    decorators.unshift(ApiExtraModels(type as ClassType<T>));
  }

  return applyDecorators(...decorators);
}
