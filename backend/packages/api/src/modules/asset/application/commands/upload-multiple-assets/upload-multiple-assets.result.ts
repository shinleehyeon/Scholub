import { DataClass } from 'dataclasses';

export class UploadMultipleAssetsResult extends DataClass {
  assets: Array<{
    id:       string;
    key:      string;
    url:      string;
    filename: string;
  }>;
}

