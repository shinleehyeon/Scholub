import { DataClass } from 'dataclasses';

export class GetPresignedUrlResult extends DataClass {
  url:       string;
  expiresAt: Date;
}

