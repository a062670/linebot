import { Module } from '@nestjs/common';
import { GoogleSearchService } from './google-search.service';
import { GoogleSearchController } from './google-search.controller';

@Module({
  controllers: [GoogleSearchController],
  providers: [GoogleSearchService],
  exports: [GoogleSearchService],
})
export class GoogleSearchModule {}
