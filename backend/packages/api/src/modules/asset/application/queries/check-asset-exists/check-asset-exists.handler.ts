import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AssetRepository } from '@/modules/asset/infrastructure';
import { CheckAssetExistsQuery } from './check-asset-exists.query';
import { CheckAssetExistsResult } from './check-asset-exists.result';

@QueryHandler(CheckAssetExistsQuery)
export class CheckAssetExistsHandler implements IQueryHandler<CheckAssetExistsQuery, CheckAssetExistsResult> {
  constructor(private readonly assetRepository: AssetRepository) {
  }

  async execute(query: CheckAssetExistsQuery): Promise<CheckAssetExistsResult> {
    const { id, key } = query;

    let asset;

    if (id) {
      asset = await this.assetRepository.findById(id);
    } else if (key) {
      asset = await this.assetRepository.findByKey(key);
    }

    return CheckAssetExistsResult.from({
      exists:  !!asset,
      assetId: asset?.id,
    });
  }
}

