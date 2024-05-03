import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiChar, GeminiUser } from './entities/gemini.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeminiChar, GeminiUser])],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
