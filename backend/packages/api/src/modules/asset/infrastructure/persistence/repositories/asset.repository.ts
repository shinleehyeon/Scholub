import { PrismaService } from '@common/modules/prisma';
import { AssetEntity } from '@modules/asset/domain/entities';
import { AssetRepositoryPort } from '@modules/asset/domain/repositories';
import { Injectable } from '@nestjs/common';
import { AssetMapper } from '../mappers';

@Injectable()
export class AssetRepository implements AssetRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(data: {
    filename:         string;
    originalFilename: string;
    contentType:      string;
    fileSize:         bigint;
    key:              string;
  }): Promise<AssetEntity> {
    const asset = await this.prisma.asset.create({ data });

    return AssetMapper.toDomain(asset);
  }

  async findById(id: string): Promise<AssetEntity | null> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });

    return asset ? AssetMapper.toDomain(asset) : null;
  }

  async findByKey(key: string): Promise<AssetEntity | null> {
    const asset = await this.prisma.asset.findUnique({ where: { key } });

    return asset ? AssetMapper.toDomain(asset) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.asset.delete({ where: { id } });
  }

  async findMany(options: {
    skip?:  number;
    take?:  number;
    where?: {
      contentType?: string;
      filename?:    string;
    };
  }): Promise<AssetEntity[]> {
    const assets = await this.prisma.asset.findMany({
      where:   options.where,
      skip:    options.skip,
      take:    options.take,
      orderBy: { createdAt: 'desc' },
    });

    return AssetMapper.toDomainList(assets);
  }

  async count(where?: {
    contentType?: string;
  }): Promise<number> {
    return this.prisma.asset.count({ where });
  }
}

