import { DataClass } from 'dataclasses';

export class CheckAssetExistsResult extends DataClass {
  exists:   boolean;
  assetId?: string;
}

