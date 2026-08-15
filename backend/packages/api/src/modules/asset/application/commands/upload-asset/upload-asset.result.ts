import { DataClass } from 'dataclasses';

export class UploadAssetResult extends DataClass {
  id:       string;
  key:      string;
  url:      string;
  filename: string;
}

