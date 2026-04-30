import { Module } from '@nestjs/common';
import { BraveSearchService } from './brave-search.service';

@Module({
  providers: [BraveSearchService],
  exports: [BraveSearchService],
})
export class BraveSearchModule {}
