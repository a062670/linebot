import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import getImageType from '@libs/getImageType';
import { BraveSearchService } from '@shared/brave-search/brave-search.service';

@Injectable()
export class StickerService {
  constructor(
    @InjectRepository(Sticker)
    private readonly stickerRepository: Repository<Sticker>,
    private readonly braveSearchService: BraveSearchService,
  ) {}

  async create(createStickerDto: CreateStickerDto) {
    const errors = await validate(
      plainToClass(CreateStickerDto, createStickerDto),
    );
    if (errors.length > 0) {
      return errors
        .reduce(
          (acc, error) => [...acc, ...Object.values(error.constraints)],
          [],
        )
        .join(', ');
    }

    const sticker = new Sticker();
    sticker.imageUrl = createStickerDto.imageUrl;
    sticker.name = createStickerDto.name;
    const imageType = await getImageType(createStickerDto.imageUrl);
    if (typeof imageType === 'string') {
      return imageType;
    }
    sticker.animated = imageType.animated;
    sticker.height = imageType.height;
    sticker.width = imageType.width;
    this.stickerRepository.save(sticker);

    return `新增成功 ${sticker.name}`;
  }

  findAll() {
    return this.stickerRepository.find();
  }

  findOne(name: string) {
    return this.stickerRepository.findOne({
      where: {
        name,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  remove(name: string) {
    return this.stickerRepository.delete({
      name,
    });
  }

  async findFromImageSearch(keyword: string) {
    const results = await this.braveSearchService.searchImage(keyword);

    for (const { imageUrl } of results) {
      try {
        if (!imageUrl.startsWith('https://')) continue;

        const headRes = await fetch(imageUrl, { method: 'HEAD' });
        const contentType = headRes.headers.get('content-type') || '';
        const contentLength = parseInt(
          headRes.headers.get('content-length') || '0',
          10,
        );

        if (!['image/jpeg', 'image/png'].includes(contentType.toLowerCase()))
          continue;

        if (contentLength > 1024 * 1024) continue;

        return {
          id: 0,
          name: keyword,
          imageUrl,
          animated: true,
          height: 0,
          width: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (err) {
        continue;
      }
    }

    return null;
  }
}
export { Sticker };
