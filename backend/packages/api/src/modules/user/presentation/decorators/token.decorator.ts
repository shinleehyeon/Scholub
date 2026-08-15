import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token provided');
  }

  return token;
});

