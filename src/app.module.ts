import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// 必須寫在上面
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './modules/line/line.module';

@Module({
  imports: [envModule, LineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
