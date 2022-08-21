import { Injectable } from '@nestjs/common';
import Notification, {
  NotificationAction,
  NotificationExtraData,
  NotificationSource
} from '@app/common-core/entities/Notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Documentation from '@app/common-core/entities/Documentation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification)
              private notificationRepository: Repository<Notification>) {

  }


  async create(notification: Notification): Promise<Notification> {
    delete notification.id;
    delete notification.updated_at;
    delete notification.created_at;
    notification.enable = true;
    return await this.notificationRepository.save(notification);
  }

  async readById(id: number) {
    await this.notificationRepository.update({ id: id }, { read: true });
  }

  async deleteByUid(uid: number) {
    await this.notificationRepository.delete({ user_id: uid });
  }

  async disableById(id: number) {
    await this.notificationRepository.update({ id: id }, { read: true, enable: false });
  }

  async roomByUserId(id: string, roomId: number): Promise<[Notification[], number]> {
    const where = `user_id='${id}' AND source='${NotificationSource.ROOM}' AND room_id=${roomId} AND enable=true`;
    return await this.notificationRepository.findAndCount({ where: where, order: { id: -1 }, take: 100 });
  }

  async roomHandUpList(id: string, roomId: number): Promise<[Notification[], number]> {
    return await this.notificationRepository.findAndCount({
      where: {
        user_id: id,
        source: NotificationSource.ROOM,
        room_id: roomId,
        action: NotificationAction.HAND_UP
      }, order: { id: -1 }
    });
  }

  async roomHandDown(id: number) {
    await this.notificationRepository.update({ id: id }, { enable: false, read: true });
  }

  async notificationByUserId(id: string): Promise<[Notification[], number]> {
    const where = `user_id='${id}' AND source='${NotificationSource.PERSONAL}' AND enable=true`;
    return await this.notificationRepository.findAndCount({ where: where, order: { id: -1 } });
  }


  async findOneById(id: number): Promise<Notification> {
    return await this.notificationRepository.findOne({ id: id });
  }
}