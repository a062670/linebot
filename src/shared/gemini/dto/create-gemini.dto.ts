import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGeminiCharDto {
  @IsNotEmpty({ message: '名稱不得為空' })
  @IsString({ message: '名稱必須為字串' })
  @MaxLength(5, { message: '名稱不得超過 5 個字' })
  name: string;

  @IsNotEmpty({ message: '描述不得為空' })
  @IsString({ message: '描述必須為字串' })
  description: string;

  @IsNotEmpty({ message: '資訊不得為空' })
  @IsString({ message: '資訊必須為字串' })
  info: string;

  @IsString({ message: '第一則訊息必須為字串' })
  firstMessage: string;
}

export class CreateGeminiUserDto {
  @IsNotEmpty({ message: '名稱不得為空' })
  @IsString({ message: '名稱必須為字串' })
  @MaxLength(5, { message: '名稱不得超過 5 個字' })
  name: string;

  @IsString({ message: '資訊必須為字串' })
  info: string;

  @IsNotEmpty({ message: 'userId 不得為空' })
  @IsString({ message: 'userId 必須為字串' })
  userId: string;
}
