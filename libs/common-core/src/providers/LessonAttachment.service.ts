import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QueryList } from '../../../../apps/live-class/src/utils/request';
import Class from '../entities/Class.entity';
import LessonAttachment from '../entities/LessonAttachment.entity';

@Injectable()
export class LessonAttachmentService {
  constructor(
    @InjectRepository(LessonAttachment)
    private lessonAttachmentRepository: Repository<LessonAttachment>,
  ) {
  }

  getList(query: QueryList): Promise<[LessonAttachment[], number]> {
    const pageSize = query.page_size ? query.page_size : 20;
    let skip = 0;
    if (query.page > 1) {
      skip = (query.page - 1) * pageSize;
    }
    let condition=''
    if (query.search){
      condition=`name LIKE '%${query.search}%'`
    }
    return this.lessonAttachmentRepository.findAndCount({
      skip: skip,
      take: pageSize,
      where: condition?condition:undefined,
    });
  }

  async create(cl: LessonAttachment): Promise<LessonAttachment> {
    delete cl.id;
    delete cl.updated_at;
    delete cl.created_at;
    return await this.lessonAttachmentRepository.save(cl);
  }

  async update(cl: LessonAttachment): Promise<LessonAttachment> {
    await this.lessonAttachmentRepository.update({ id: cl.id }, cl);
    return cl;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.lessonAttachmentRepository.delete({ id: id });
    console.log('res', result);
    return result.affected > 0;
  }
}
