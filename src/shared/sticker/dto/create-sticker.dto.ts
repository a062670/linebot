import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateStickerDto {
  @IsNotEmpty({ message: '名稱不得為空' })
  @IsString({ message: '名稱必須為字串' })
  @MaxLength(10, { message: '名稱不得超過 10 個字' })
  name: string;

  @IsNotEmpty({ message: '圖片網址不得為空' })
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
    },
    { message: '圖片網址格式錯誤' },
  )
  imageUrl: string;
}
