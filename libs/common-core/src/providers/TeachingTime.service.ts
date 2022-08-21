import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QueryList } from '../../../../apps/live-class/src/utils/request';
import Class from '../entities/Class.entity';
import *as moment from 'moment';
import { TeachingTime } from '../entities/TeachingTime';

@Injectable()
export class TeachingTimeService {
  constructor(
    @InjectRepository(TeachingTime)
    private teachingTimeRepository: Repository<TeachingTime>,
  ) {
  }

  getTeacherTimeByDay(host: number,date: Date): Promise<[TeachingTime[], number]> {
    const start=moment(date).format('YYYY-MM-DD 00:00:00')
    const end=moment(date).format('YYYY-MM-DD 23:59:59')
    return this.teachingTimeRepository.findAndCount({where:`started_at BETWEEN '${start}' AND '${end}'`});
  }

  async create(teachingTime: TeachingTime): Promise<TeachingTime> {
    return await this.teachingTimeRepository.save(teachingTime);
  }

}
