import { DataClass } from 'dataclasses';

export class UploadAssetCommand extends DataClass {
  file:  Express.Multer.File;
  path?: string;
}

