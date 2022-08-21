import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QueryList } from '../../../../apps/live-class/src/utils/request';
import Class from '../entities/Class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {
  }

  getList(query: QueryList): Promise<[Class[], number]> {
    const pageSize = query.page_size ? query.page_size : 20;
    let skip = 0;
    if (query.page > 1) {
      skip = (query.page - 1) * pageSize;
    }
    let condition = '';
    if (query.search) {
      condition = `name LIKE '%${query.search}%'`;
    }
    return this.classRepository.findAndCount({
      skip: skip,
      take: pageSize,
      where: condition ? condition : undefined,
    });
  }

  async create(cl: Class): Promise<Class> {
    delete cl.id;
    delete cl.updated_at;
    delete cl.created_at;
    return await this.classRepository.save(cl);
  }

  async findOneById(id: number): Promise<Class|undefined> {
    return await this.classRepository.findOne({ id: id });
  }

  async update(cl: Class): Promise<Class> {
    await this.classRepository.update({ id: cl.id }, cl);
    return cl;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.classRepository.delete({ id: id });
    console.log('res', result);
    return result.affected > 0;
  }
}
