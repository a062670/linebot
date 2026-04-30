import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { BraveSearchModule } from '@shared/brave-search/brave-search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), BraveSearchModule],
  controllers: [StickerController],
  providers: [StickerService],
  exports: [StickerService],
})
export class StickerModule {}
