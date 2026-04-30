import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async save(input: { sourceId: string; userId: string; text: string }) {
    const message = new Message();
    message.sourceId = input.sourceId;
    message.userId = input.userId;
    message.text = input.text;
    return this.messageRepository.save(message);
  }

  async findRecent(sourceId: string, limit: number) {
    const items = await this.messageRepository.find({
      where: { sourceId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return items.reverse();
  }
}

export { Message };
