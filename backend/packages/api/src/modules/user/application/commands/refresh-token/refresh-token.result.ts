import { DataClass } from 'dataclasses';

export class RefreshTokenResult extends DataClass {
  accessToken:  string;
  refreshToken: string;
}

