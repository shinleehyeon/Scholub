import { DataClass } from 'dataclasses';

export class LogoutCommand extends DataClass {
  userId:       string;
  refreshToken: string;
}

