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
}
export { Sticker };
