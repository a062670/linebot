import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class GeminiChar {
  @PrimaryGeneratedColumn()
  id: number;

  /** 名稱 */
  @Column({
    comment: '名稱',
  })
  name: string;

  /** 描述 */
  @Column({
    comment: '描述',
  })
  description: string;

  /** 資訊 */
  @Column({
    comment: '資訊',
  })
  info: string;

  /** 第一則訊息 */
  @Column({
    comment: '第一則訊息',
    nullable: true,
  })
  firstMessage: string;

  /** 建立時間 */
  @CreateDateColumn({
    comment: '建立時間',
  })
  createdAt: Date;
}

@Entity()
export class GeminiUser {
  @PrimaryGeneratedColumn()
  id: number;

  /** 使用者 ID */
  @Column({
    comment: '使用者 ID',
  })
  userId: string;

  /** 名稱 */
  @Column({
    comment: '名稱',
  })
  name: string;

  /** 資訊 */
  @Column({
    comment: '資訊',
  })
  info: string;
}
