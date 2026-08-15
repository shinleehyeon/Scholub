import { DataClass } from 'dataclasses';

export class UploadMultipleAssetsCommand extends DataClass {
  files: Express.Multer.File[];
  path?: string;
}

