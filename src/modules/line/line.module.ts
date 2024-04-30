import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { GptModule } from '@shared/gpt/gpt.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [GptModule],
})
export class LineModule {}
