import { DataClass } from 'dataclasses';

export class RefreshTokenCommand extends DataClass {
  refreshToken: string;
}

