import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ListQueryBuyingServicePack,
  ListQueryServicePack,
  ServicePack,
  ServicePackItem,
  ServicePackStatus,
  UpdateServicePackStatus
} from '../entities/ServicePack.entity';

@Injectable()
export class ServicePackService {
  constructor(
    @InjectRepository(ServicePack)
    private servicePackRepository: Repository<ServicePack>
  ) {
  }

  async updateStatus(request: UpdateServicePackStatus): Promise<number | undefined> {
    const update = await this.servicePackRepository.update({ id: request.id }, { status: request.status });
    return update.affected;
  }

  async getBuyingList(query: ListQueryBuyingServicePack): Promise<[ServicePack[], number]> {
    let condition = `status = '${ServicePackStatus.PUBLISHED}'`;
    if (query.search) {
      condition = condition + ` AND name LIKE '%${query.search}%' OR description LIKE '%${query.search}%'`;
    }
    let order = ['id', 'DESC'];
    if (query.sort) {
      const order2 = query.sort.split(' ');
      if (order2.length > 1) {
        order = order2;
      }

    }
    return await this.servicePackRepository.findAndCount({
      skip: ((query.page - 1) * query.page_size),
      take: query.page_size,
      where: condition,
      order: {}
    });
  }


  async getList(query: ListQueryServicePack): Promise<[ServicePack[], number]> {
    const pageSize = query.page_size ? query.page_size : 20;
    let skip = 0;
    if (query.page > 1) {
      skip = (query.page - 1) * pageSize;
    }
    let condition = '';
    if (query.search) {
      condition = `name LIKE '%${query.search}%' OR description LIKE '%${query.search}%'`;
    }
    if (query.creator) {
      condition = condition + ` creator=${query.creator}`;
    }
    if (query.status) {
      condition = condition + ` status='${query.status}'`;
    }
    if (query.class_number) {
      condition = condition + ` class_number=${query.class_number}`;
    }
    if (query.day_number) {
      condition = condition + ` day_number=${query.day_number}`;
    }
    if (query.price) {
      condition = condition + ` price=${query.price}`;
    }
    if (query.slash_price) {
      condition = condition + ` slash_price=${query.slash_price}`;
    }
    if (query.teaching_time_number) {
      condition = condition + ` teaching_time_number=${query.teaching_time_number}`;
    }
    let order = ['id', 'DESC'];
    if (query.sort) {
      const order2 = query.sort.split(' ');
      if (order2.length > 1) {
        order = order2;
      }

    }
    return await this.servicePackRepository.findAndCount({
      skip: skip,
      take: pageSize,
      where: condition ? condition : undefined,
      order: {}
    });
  }

  async getItemJoinList(query: ListQueryServicePack): Promise<[ServicePackItem[], number]> {
    const pageSize = query.page_size ? query.page_size : 20;
    let skip = 0;
    if (query.page > 1) {
      skip = (query.page - 1) * pageSize;
    }
    let condition = '';
    if (query.search) {
      condition = `name LIKE '%${query.search}%' OR description LIKE '%${query.search}%'`;
    }
    if (query.creator) {
      condition = condition + ` creator=${query.creator}`;
    }
    if (query.status) {
      condition = condition + ` status='${query.status}'`;
    }
    if (query.class_number) {
      condition = condition + ` class_number=${query.class_number}`;
    }
    if (query.day_number) {
      condition = condition + ` day_number=${query.day_number}`;
    }
    if (query.price) {
      condition = condition + ` price=${query.price}`;
    }
    if (query.slash_price) {
      condition = condition + ` slash_price=${query.slash_price}`;
    }
    if (query.teaching_time_number) {
      condition = condition + ` teaching_time_number=${query.teaching_time_number}`;
    }

    let order = ['id', 'DESC'];
    if (query.sort) {
      const order2 = query.sort.split(' ');
      if (order2.length > 1) {
        order = order2;
      }

    }
    const count = await this.servicePackRepository.count({ where: condition });
    let lastCondition = '';
    if (condition) {
      lastCondition = 'WHERE ' + condition;
    }
    const res = await this.servicePackRepository.query(`SELECT service_packs.*,COUNT(service_pack_transactions.id) as bought_number FROM service_packs 
LEFT JOIN service_pack_transactions ON service_pack_transactions.service_pack_id = service_packs.id GROUP BY service_packs.id ${lastCondition} LIMIT ${pageSize} OFFSET ${skip}`);
    return [res, count];
  }

  async createServicePack(servicePack: ServicePack): Promise<ServicePack> {
    delete servicePack.id;
    delete servicePack.updated_at;
    delete servicePack.created_at;
    if (!servicePack.extra_data) {
      servicePack.extra_data = undefined;
    }
    servicePack.status = ServicePackStatus.DRAFT;
    return await this.servicePackRepository.save(servicePack);
  }

  async updateServicePack(servicePack: ServicePack): Promise<ServicePack> {
    if (!servicePack.extra_data) {
      servicePack.extra_data = undefined;
    }
    delete servicePack.updated_at;
    delete servicePack.created_at;
    await this.servicePackRepository.update({ id: servicePack.id }, servicePack);
    return servicePack;
  }

  async find_PUBLISHED_ById(id: number): Promise<ServicePack | undefined> {
    return await this.servicePackRepository.findOne({ id: id, status: ServicePackStatus.PUBLISHED });
  }

  async findOneById(id: number): Promise<ServicePack> {
    return await this.servicePackRepository.findOne({ id: id});
  }

  async deleteServicePack(id: number): Promise<boolean> {
    const result = await this.servicePackRepository.delete({ id: id });
    console.log('res', result);
    return result.affected > 0;
  }
}
