import type { AssetEntity } from '../entities';

export interface AssetRepositoryPort {
  create(data: {
    filename:         string;
    originalFilename: string;
    contentType:      string;
    fileSize:         bigint;
    key:              string;
  }): Promise<AssetEntity>;

  findById(id: string): Promise<AssetEntity | null>;

  findByKey(key: string): Promise<AssetEntity | null>;

  delete(id: string): Promise<void>;

  findMany(options: {
    skip?:  number;
    take?:  number;
    where?: {
      contentType?: string;
      filename?:    string;
    };
  }): Promise<AssetEntity[]>;

  count(where?: {
    contentType?: string;
  }): Promise<number>;
}

