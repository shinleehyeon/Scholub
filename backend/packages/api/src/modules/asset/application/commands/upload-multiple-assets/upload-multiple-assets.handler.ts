import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { S3Service } from '@/common/modules/s3';
import { AssetRepository } from '@/modules/asset/infrastructure';
import { UploadMultipleAssetsCommand } from './upload-multiple-assets.command';
import { UploadMultipleAssetsResult } from './upload-multiple-assets.result';

@CommandHandler(UploadMultipleAssetsCommand)
export class UploadMultipleAssetsHandler
implements ICommandHandler<UploadMultipleAssetsCommand, UploadMultipleAssetsResult> {
  constructor(private readonly s3Service: S3Service,
    private readonly assetRepository: AssetRepository) {
  }

  async execute(command: UploadMultipleAssetsCommand): Promise<UploadMultipleAssetsResult> {
    const { files, path } = command;

    const uploadResults = await Promise.all(files.map(async file => {
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

      const url = await this.s3Service.getPublicUrl(key);

      return {
        id:       asset.id,
        key,
        url,
        filename: asset.filename,
      };
    }));

    return UploadMultipleAssetsResult.from({ assets: uploadResults });
  }
}

