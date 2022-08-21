import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicePackTransaction, ServicePackTransactionStatus } from '../entities/ServicePackTransaction.entity';
import *as moment from 'moment';

@Injectable()
export class ServicePackTransactionService {
  constructor(
    @InjectRepository(ServicePackTransaction)
    private transactionRepository: Repository<ServicePackTransaction>,
  ) {
  }

  async create(transaction: ServicePackTransaction): Promise<ServicePackTransaction> {
    delete transaction.id;
    delete transaction.updated_at;
    delete transaction.created_at;
    transaction.status = ServicePackTransactionStatus.INITIATED;
    return await this.transactionRepository.save(transaction);
  }

  async find_INITIATED_TransById(id: number): Promise<ServicePackTransaction | undefined> {
    return await this.transactionRepository.findOne({
      id: id,
      status: ServicePackTransactionStatus.INITIATED,
    });
  }

  async findOneById(id: number): Promise<ServicePackTransaction | undefined> {
    return await this.transactionRepository.findOne({
      id: id,
    });
  }

  async findById(id: number): Promise<[ServicePackTransaction[], number]> {
    return await this.transactionRepository.findAndCount({
      user_id: id,
    });
  }

  async find_PAID_ById(id: number): Promise<ServicePackTransaction | undefined> {
    return await this.transactionRepository.findOne({
      id: id,
    });
  }

  async find_ACTIVATED_ByUserId(id: number): Promise<ServicePackTransaction | undefined> {
    return await this.transactionRepository.findOne({
      user_id: id,
      status: ServicePackTransactionStatus.ACTIVATED,
    });
  }

  async find_ACTIVATED_valid_ByUserId(id: string): Promise<ServicePackTransaction | undefined> {
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    return await this.transactionRepository.findOne({
      where: `status = '${ServicePackTransactionStatus.ACTIVATED}' AND user_id = ${id} AND expiry > '${today}'`,
    });
  }

  async confirmTrans(id: number): Promise<number> {
    const result = await this.transactionRepository.update({
      id: id,
      status: ServicePackTransactionStatus.INITIATED,
    }, { status: ServicePackTransactionStatus.CONFIRMED });
    return result.affected;
  }

  async payTrans(id: number): Promise<number> {
    const result = await this.transactionRepository.update({
      id: id,
    }, { status: ServicePackTransactionStatus.PAID });
    return result.affected;
  }

  async activateTrans(trans: ServicePackTransaction): Promise<ServicePackTransaction | undefined> {
    trans.activated = new Date();
    trans.expiry = moment().add(trans.day_number, 'days').toDate();
    const result = await this.transactionRepository.update({
      id: trans.id,
    }, { status: ServicePackTransactionStatus.ACTIVATED, activated: trans.activated, expiry: trans.expiry });
    if (!result.affected) {
      return undefined;
    }
    return trans;
  }

}
