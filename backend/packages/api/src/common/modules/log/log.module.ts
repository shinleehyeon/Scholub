import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaModule, PrismaService } from '@/common/modules/prisma';
import { LogRepository } from './log.repository';
import { LogService } from './log.service';
import { LogTransport } from './log.transport';

@Global()
@Module({
  imports: [
    PrismaModule,
    WinstonModule.forRootAsync({
      inject:     [PrismaService],
      useFactory: (prisma: PrismaService) => {
        const transports: winston.transport[] = [
          new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({
              timestamp,
              level,
              message,
              context,
            }) => {
              return `[${timestamp}] ${level} ${context ? `[${context}]` : ''} ${message}`;
            })) }),
        ];

        if (process.env.NODE_ENV === 'production') {
          transports.push(new LogTransport({
            prisma,
            level: 'warn',
          }));
        }

        return { transports };
      },
    }),
  ],
  providers: [LogRepository, LogService],
  exports:   [
    WinstonModule, LogService, LogRepository,
  ],
})
export class LogModule {
}
