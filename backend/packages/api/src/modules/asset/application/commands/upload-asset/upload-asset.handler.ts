import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { S3Service } from '@/common/modules/s3';
import { AssetRepository } from '@/modules/asset/infrastructure';
import { UploadAssetCommand } from './upload-asset.command';
import { UploadAssetResult } from './upload-asset.result';

@CommandHandler(UploadAssetCommand)
export class UploadAssetHandler implements ICommandHandler<UploadAssetCommand, UploadAssetResult> {
  constructor(private readonly s3Service: S3Service,
    private readonly assetRepository: AssetRepository) {
  }

  async execute(command: UploadAssetCommand): Promise<UploadAssetResult> {
    const { file, path } = command;

    const key = await this.s3Service.upload({
      file:      file.buffer,
      filename:  file.originalname,
      mimeType:  file.mimetype,
      directory: path,
    });

    const asset = await this.assetRepository.create({
      filename:         file.originalname,
      originalFilename: file.originalname,
      contentType:      file.mimetype,
      fileSize:         BigInt(file.size),
      key,
    });

    const url = this.s3Service.getPublicUrl(key);

    return UploadAssetResult.from({
      id:       asset.id,
      key,
      url,
      filename: asset.filename,
    });
  }
}

