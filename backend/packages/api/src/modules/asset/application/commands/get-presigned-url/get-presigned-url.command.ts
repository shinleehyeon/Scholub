import { DataClass } from 'dataclasses';

export class GetPresignedUrlCommand extends DataClass {
  id:         string;
  expiresIn?: number;
}
