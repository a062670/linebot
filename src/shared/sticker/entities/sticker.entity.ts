import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Sticker {
  @PrimaryGeneratedColumn()
  id: number;

  /** 名稱 */
  @Column({
    comment: '名稱',
  })
  name: string;

  /** 圖片網址 */
  @Column({
    comment: '圖片網址',
  })
  imageUrl: string;

  /** 是否為動圖 */
  @Column({
    comment: '是否為動圖',
    default: false,
  })
  animated: boolean;

  /** 寬度 */
  @Column({
    comment: '寬度',
    nullable: true,
  })
  width: number;

  /** 高度 */
  @Column({
    comment: '高度',
    nullable: true,
  })
  height: number;

  /** 建立時間 */
  @CreateDateColumn({
    comment: '建立時間',
  })
  createdAt: Date;
}
