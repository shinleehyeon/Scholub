import { LogService } from '@common/modules/log';
import { RedisService } from '@common/modules/redis';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { LogoutResult } from './logout.result';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, LogoutResult> {
  constructor(private readonly redis: RedisService,
    private readonly logger: LogService) {
  }

  async execute(command: LogoutCommand): Promise<LogoutResult> {
    const removed = await this.redis.srem(`refresh:${command.userId}`, command.refreshToken);

    if (!removed) {
      throw new UnauthorizedException('Refresh token mismatch during logout');
    }

    this.logger.log('Auth', `Logout success (User ID: ${command.userId})`);

    return LogoutResult.from({ success: true });
  }
}

