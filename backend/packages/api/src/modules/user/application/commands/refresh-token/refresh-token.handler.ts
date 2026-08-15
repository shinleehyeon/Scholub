import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN_SECONDS } from '@modules/user/domain/constants/token.constants';
import { JwtPayload } from '@modules/user/domain/types/jwt-payload.type';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@/common/modules/redis';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenResult } from './refresh-token.result';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult> {
  constructor(private readonly jwtService: JwtService,
    private readonly redis: RedisService) {
  }

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(command.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type for refresh');
    }

    const exists = await this.redis.sismember(`refresh:${payload.sub}`, command.refreshToken);

    if (!exists) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const tokens = await this.generateTokens(payload.sub);

    return RefreshTokenResult.from(tokens);
  }

  private async generateTokens(userId: string) {
    const accessTokenPayload: JwtPayload = {
      sub: userId, type: 'access',
    };

    const refreshTokenPayload: JwtPayload = {
      sub: userId, type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_SECONDS}s` });

    await this.redis.sadd(`refresh:${userId}`, refreshToken);

    await this.redis.expire(`refresh:${userId}`, REFRESH_TOKEN_EXPIRES_IN_SECONDS);

    return {
      accessToken, refreshToken,
    };
  }
}

