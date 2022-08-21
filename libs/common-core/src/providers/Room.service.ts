import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { QueryList } from '../../../../apps/live-class/src/utils/request';
import Class from '../entities/Class.entity';
import Room, { ListQueryRooms, RoomExtraData } from '../entities/Room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {
  }


  async create(room: Room): Promise<Room> {
    delete room.id;
    delete room.updated_at;
    delete room.created_at;
    return await this.roomRepository.save(room);
  }

  async update(room: Room): Promise<Room> {
    delete room.updated_at;
    await this.roomRepository.update({ id: room.id }, room);
    room.updated_at = new Date();
    return room;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomRepository.delete({ id: id });
    console.log('res', result);
    return result.affected > 0;
  }

  async findByCreatorId(id: string, query: ListQueryRooms): Promise<[Room[], number]> {
    let conditions = `creator = '${id}'`;
    if (query.search) {
      conditions = conditions + ` AND name LIKE '%${query.search}%'`;
    }
    let sort = ['id', 'DESC'];
    if (query.sort) {
      sort = query.sort.split(' ');
    }
    return await this.roomRepository.findAndCount({
      where: conditions,
      take: query.page_size,
      skip: ((query.page - 1) * query.page_size),
      order: {
        [sort[0]]: sort[1]
      }
    });
  }

  async findOneById(id: number): Promise<Room | undefined> {
    return await this.roomRepository.findOne({ id: id });
  }

  async updateAgoraRoomUid(room: Room): Promise<number> {
    const update = await this.roomRepository.update({ id: room.id }, { agora_room_uuid: room.agora_room_uuid });
    return update.affected;
  }

  async rollCallUpdate(id: number, isRollCall: boolean, auto_roll_call_every_minutes: number) {
    const room = await this.roomRepository.findOne({ id: id });
    if (room.extra_data) {
      let extraData = room.extra_data;
      extraData.is_auto_roll_call = isRollCall;
      await this.roomRepository.update({ id: id }, { extra_data: extraData });
    } else {
      let extraData: RoomExtraData = {
        is_auto_roll_call: true,
        auto_roll_call_every_minutes: auto_roll_call_every_minutes
      };
      await this.roomRepository.update({ id: id }, { extra_data: extraData });
    }
  }

}
