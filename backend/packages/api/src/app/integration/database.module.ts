import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '@/common/modules/prisma';
import { RedisModule } from '@/common/modules/redis';

@Global()
@Module({
  imports: [PrismaModule, RedisModule],
  exports: [PrismaModule, RedisModule],
})
export class DatabaseModule {
}
