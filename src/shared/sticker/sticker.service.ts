import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import getImageType from '@libs/getImageType';

@Injectable()
export class StickerService {
  constructor(
    @InjectRepository(Sticker)
    private readonly stickerRepository: Repository<Sticker>,
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

  async findFromGoogle(keyword: string) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(keyword)}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&key=${process.env.GOOGLE_SEARCH_API_KEY}&searchType=image&num=10`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    for (const item of data.items) {
      try {
        const imgUrl = item.link;

        // 檢查 HTTPS
        if (!imgUrl.startsWith('https://')) continue;

        // 取得圖片 HEAD
        const headRes = await fetch(imgUrl, { method: 'HEAD' });
        const contentType = headRes.headers.get('content-type') || '';
        const contentLength = parseInt(
          headRes.headers.get('content-length') || '0',
          10,
        );

        // 格式檢查：JPEG 或 PNG
        if (!['image/jpeg', 'image/png'].includes(contentType.toLowerCase()))
          continue;

        // 大小檢查：≤ 1 MB
        if (contentLength > 1024 * 1024) continue;

        return {
          id: 0,
          name: keyword,
          imageUrl: imgUrl,
          animated: true,
          height: 0,
          width: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (err) {
        // 忽略錯誤繼續下一張
        continue;
      }
    }

    return null;
  }
}
export { Sticker };
