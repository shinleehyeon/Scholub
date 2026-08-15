import { NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { S3Service } from '@/common/modules/s3';
import { AssetRepository } from '@/modules/asset/infrastructure';
import { DeleteAssetCommand } from './delete-asset.command';

@CommandHandler(DeleteAssetCommand)
export class DeleteAssetHandler implements ICommandHandler<DeleteAssetCommand, void> {
  constructor(private readonly s3Service: S3Service,
    private readonly assetRepository: AssetRepository) {
  }

  async execute(command: DeleteAssetCommand): Promise<void> {
    const { id } = command;
    const asset = await this.assetRepository.findById(id);

    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }

    await this.s3Service.delete(asset.key);

    await this.assetRepository.delete(id);
  }
}

