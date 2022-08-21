import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RoomService } from '@app/common-core/providers/Room.service';
import Room, { RoomExtraData } from '@app/common-core/entities/Room.entity';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import { EventsGateway } from '../events.gateway';
import { GatewayRoomSubKeys } from '@app/common-core/models/Gateway.model';
import { RollCallService } from '@app/common-core/providers/RollCall.service';
import { RoomRollCallReq } from '../../../live-class/src/utils/request';
import { NotificationService } from '@app/common-core/providers/Notification.service';
import Notification, { NotificationAction, NotificationSource } from '@app/common-core/entities/Notification.entity';
import User, { UserRole } from '@app/common-core/entities/User.entity';

@Injectable()
export class TaskRollCallService {
  constructor(private schedulerRegistry: SchedulerRegistry, private roomService: RoomService,
              private attendanceService: AttendanceService,
              private readonly eventsGateway: EventsGateway,
              private readonly notificationService: NotificationService,
              private readonly rollCallService: RollCallService) {

  }

  cancelAutoRollCallJob(room: Room) {
    const CRON_KEY = 'AUTO_ROLL_CALL_ROOM_' + room.id;
    try {
      const job = this.schedulerRegistry.getCronJob(CRON_KEY);
      if (job) {
        job.stop();
        this.schedulerRegistry.deleteCronJob(CRON_KEY);
      }
    } catch (e) {
      console.error(e);
    }

  }

  async addAutoRollCallJob(sender: User, roomId: number) {
    console.log('req', JSON.stringify(sender));
    const room = await this.roomService.findOneById(roomId);
    if (!room) {
      return;
    }
    const CRON_KEY = 'AUTO_ROLL_CALL_ROOM_' + room.id;
    try {
      this.cancelAutoRollCallJob(room);
      const verify = (r: Room): RoomExtraData | undefined => {
        try {
          if (r.extra_data) {
            if (r.extra_data.is_auto_roll_call) {
              return r.extra_data;
            }
          }
        } catch (e) {
          console.error(e);
        }
        return undefined;
      };
      const extraData = verify(room);
      if (extraData) {
        const job = new CronJob(`0 */${extraData.auto_roll_call_every_minutes ? extraData.auto_roll_call_every_minutes : 5} * * * *`, () => {
          if (verify(room)) {
            console.log('req', JSON.stringify(sender));
            this._startAutoRollCall(sender, room).then();
          } else {
            job.stop();
            this.schedulerRegistry.deleteCronJob(CRON_KEY);
          }
        });
        this.schedulerRegistry.addCronJob(CRON_KEY, job);
        job.start();
      } else {
        this.cancelAutoRollCallJob(room);
      }
    } catch (e) {
      console.error(e);
    }

  }

  async _startAutoRollCall(sender: User, room: Room) {
    try {
      const result = await this.attendanceService.getAttendants(room.id);
      const attendants = result[0].filter(x => !(x.user_data && x.user_data.role && x.user_data.role==UserRole.HOST));
      if (attendants && attendants.length) {
        let i = 0;
        const loop = async () => {
          if (i < attendants.length) {
            await this._startRollCallByAttendant(sender, room, attendants[i].user_id);
            i++;
            setTimeoutLoop();
          }
        };
        const setTimeoutLoop = () => {
          setTimeout(() => {
            loop();
          }, 1500);
        };
        setTimeoutLoop();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async _startRollCallByAttendant(sender: User, room: Room, attendantUid: number) {
    const rollCall = await this.rollCallService.create({
      requested_time: new Date(),
      class_id: room.class_id,
      room_id: room.id,
      user_id: attendantUid,
      creator: sender.id,
    });
    const create: Notification = {
      room_id: room.id,
      class_id: room.class_id,
      user_id: attendantUid,
      source: NotificationSource.ROOM,
      action: NotificationAction.ROLL_CALL,
      extra_data: {
        checked: false,
        room_id: room.id,
        class_id: room.class_id,
        sender: sender,
        roll_call_id: rollCall.id,
      },
    };
    const notification = await this.notificationService.create(create);
    this.eventsGateway.sendToRoom(GatewayRoomSubKeys.USER_MESSAGE + attendantUid, GatewayRoomSubKeys.NOTIFICATION, notification);
  }

  async startRollCallByManyAttendants(rollCallReq: RoomRollCallReq, attendants: number[]) {
    const room = await this.roomService.findOneById(rollCallReq.room_id);
    if (room && attendants && attendants.length) {
      attendants.map((item) => {
        this._startRollCallByAttendant(rollCallReq.user, room, item).then();
      });
    }
  }

  async endRoom(room: Room) {
    if (room.extra_data) {
      room.extra_data.is_auto_roll_call = false;
    } else {
      room.extra_data = {
        is_auto_roll_call: false,
        auto_roll_call_every_minutes: 5,
      };
    }
    room.ended_at=new Date();
    await this.roomService.update(room);
    this.cancelAutoRollCallJob(room);

  }

}