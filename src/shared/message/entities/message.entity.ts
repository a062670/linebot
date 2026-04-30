import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  /** 訊息來源 (user-xxx / group-xxx / room-xxx) */
  @Index()
  @Column({
    comment: '訊息來源 (user-xxx / group-xxx / room-xxx)',
  })
  sourceId: string;

  /** 發訊者 LINE userId */
  @Column({
    comment: '發訊者 LINE userId',
  })
  userId: string;

  /** 訊息內容 */
  @Column('text', {
    comment: '訊息內容',
  })
  text: string;

  /** 建立時間 */
  @CreateDateColumn({
    comment: '建立時間',
  })
  createdAt: Date;
}
