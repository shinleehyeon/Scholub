import { NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { S3Service } from '@/common/modules/s3';
import { AssetRepository } from '@/modules/asset/infrastructure';
import { GetPresignedUrlCommand } from './get-presigned-url.command';
import { GetPresignedUrlResult } from './get-presigned-url.result';

@CommandHandler(GetPresignedUrlCommand)
export class GetPresignedUrlHandler
implements ICommandHandler<GetPresignedUrlCommand, GetPresignedUrlResult> {
  constructor(private readonly s3Service: S3Service,
    private readonly assetRepository: AssetRepository) {
  }

  async execute(command: GetPresignedUrlCommand): Promise<GetPresignedUrlResult> {
    const { id, expiresIn = 3600 } = command;    const asset = await this.assetRepository.findById(id);

    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }

    const url = await this.s3Service.getPresignedUrl(asset.key, { expiresIn });
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));

    return GetPresignedUrlResult.from({
      url,
      expiresAt,
    });
  }
}

