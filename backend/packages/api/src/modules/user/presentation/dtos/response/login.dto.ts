import { ApiProperty } from '@nestjs/swagger';
import { DataClass } from 'dataclasses';

export class LoginResponseDto extends DataClass {
  @ApiProperty({
    description: 'The access token of the user',
    example:     'accessToken',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token of the user',
    example:     'refreshToken',
  })
  refreshToken: string;
}
