import { INestApplication } from '@nestjs/common';

export function applyCors(app: INestApplication, origin: string[]) {
  app.enableCors({
    origin,
    methods: [
      'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD',
    ],
    credentials: true,
  });
}
