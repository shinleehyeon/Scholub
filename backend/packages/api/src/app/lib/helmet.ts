import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function applyHelmet(app: INestApplication) {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy:   { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  }));
}
