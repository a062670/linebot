import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker])],
  controllers: [StickerController],
  providers: [StickerService],
  exports: [StickerService],
})
export class StickerModule {}
