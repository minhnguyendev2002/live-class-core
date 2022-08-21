import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import Class from '@app/common-core/entities/Class.entity';
import { Repository } from 'typeorm';
import RollCall from '@app/common-core/entities/RollCall.entity';

@Injectable()
export class RollCallService {
  constructor(
    @InjectRepository(RollCall)
    private rollCallRepository: Repository<RollCall>
  ) {
  }

  async create(rollCall: RollCall) {
    delete rollCall.id;
    delete rollCall.updated_at;
    delete rollCall.created_at;
    return await this.rollCallRepository.save(rollCall);
  }

  async findOneById(id: number) {
    return await this.rollCallRepository.findOne({ id: id });
  }

  async verifyRollCall(id: number) {
    return await this.rollCallRepository.update({ id: id }, { checked_time: new Date() });
  }

}