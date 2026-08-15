import { DataClass } from 'dataclasses';

export class GetAssetDetailResult extends DataClass {
  id:               string;
  filename:         string;
  originalFilename: string;
  contentType:      string;
  fileSize:         bigint;
  key:              string;
  url:              string;
  createdAt:        Date;
}

