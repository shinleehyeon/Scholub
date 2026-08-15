import { JwtPayload } from '@modules/user/domain/types/jwt-payload.type';
import { UserRepository } from '@modules/user/infrastructure/persistence';
import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ValidateAccessTokenQuery } from './validate-access-token.query';
import { ValidateAccessTokenResult } from './validate-access-token.result';

@QueryHandler(ValidateAccessTokenQuery)
export class ValidateAccessTokenHandler implements IQueryHandler<ValidateAccessTokenQuery, ValidateAccessTokenResult> {
  constructor(private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository) {
  }

  async execute(query: ValidateAccessTokenQuery): Promise<ValidateAccessTokenResult> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(query.accessToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type for this API');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return ValidateAccessTokenResult.from({ user });
  }
}

