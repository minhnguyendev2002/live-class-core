import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from '@app/common-core/entities/Attendance.entity';
import { RoomService } from '@app/common-core/providers/Room.service';
import Room from '@app/common-core/entities/Room.entity';
import User from '@app/common-core/entities/User.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private roomService: RoomService
  ) {
  }

 
  async getAttendants(roomId: number): Promise<[Attendance[], number]> {
    return await this.attendanceRepository.findAndCount({ room_id: roomId });
  }

  async getAttendantByUId(roomId: number, id: number): Promise<Attendance> {
    return await this.attendanceRepository.findOne({ room_id: roomId, user_id: id });
  }

  async create(attendance: Attendance): Promise<Attendance> {
    return await this.attendanceRepository.save(attendance);
  }

  async updateStatus(roomId: number, userId: number, status: AttendanceStatus) {
    const one = await this.attendanceRepository.findOne({ room_id: roomId, user_id: userId });
    if (one) {
      await this.attendanceRepository.update({ id: one.id }, { status: status });
    }
  }

  async delete(room_id: number, user_id: number): Promise<boolean> {
    const result = await this.attendanceRepository.delete({ room_id, user_id });
    console.log('res', result);
    return result.affected > 0;
  }

  async createJoinRoom(roomId: number, user: User) {
    try {
      const room = await this.roomService.findOneById(roomId);
      if (room) {
        await this.attendanceRepository.save({
          status: AttendanceStatus.OFFLINE,
          username: user.username,
          user_id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          full_name:user.full_name,
          user_data: user,
          room_id: roomId, class_id: room.class_id
        });
      }

    } catch (e) {
      console.error(e);
    }
  }

  async createJoinRoom2(room: Room, user: User) {
    try {
      if (room) {
        await this.attendanceRepository.save({
          status: AttendanceStatus.OFFLINE,
          username: user.username,
          user_id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          full_name:user.full_name,
          user_data: user,
          room_id: room.id, class_id: room.class_id
        });
      }

    } catch (e) {
      console.error(e);
    }
  }
}
