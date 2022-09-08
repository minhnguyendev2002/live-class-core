import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomReq } from '../../live-class/src/utils/request';
import { AttendanceService } from '@app/common-core/providers/Attendance.service';
import { AttendanceStatus } from '@app/common-core/entities/Attendance.entity';
import {
  GatewayRoomSubKeys,
  GatewayRoomTraceActions,
  GatewayRoomTraceRes,
} from '@app/common-core/models/Gateway.model';
import { JwtService } from '@nestjs/jwt';
import { ConversationPrefix } from '@app/common-core/util/Constant';
import { RoomService } from '@app/common-core/providers/Room.service';
import User from '@app/common-core/entities/User.entity';

@WebSocketGateway(3101, {
  cors: {
    origin: '*',
    methods: '*'
  }
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly attendanceService: AttendanceService, private jwtService: JwtService, private readonly roomService: RoomService) {
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(@MessageBody() joinRoomReq: JoinRoomReq,
                       @ConnectedSocket() socket: Socket) {
    try {
      const user = await this.verify(socket);
      if (user) {
        console.log('handleJoinRoom', joinRoomReq);
        const room = await this.roomService.findOneById(joinRoomReq.room_id);
        if (!room) {
          this._errorTraceSend(socket, { message: 'Room invalid' });
          return;
        } 
        // else if (room.ended_at) {
        //   if (room.ended_at.getTime() <= (new Date().getTime()))
        //   {
        //     this._errorTraceSend(socket, { message: 'Room is ended' });
        //     return;
        //   }
        // }
        if (joinRoomReq && joinRoomReq.room_id) {
          // const attendant = await this.attendanceService.getAttendantByUId(joinRoomReq.room_id, user.id);
          // if (!attendant) {
          //   this._errorTraceSend(socket, { message: 'Permission denied, maybe you have not been accepted to join this room' });
          //   return;
          // }
          socket.join(ConversationPrefix.getRoomPrefix(joinRoomReq.room_id));
          this.attendanceService.updateStatus(joinRoomReq.room_id, user.id, AttendanceStatus.ONLINE).then();
          const roomTrace: GatewayRoomTraceRes = {
            action: GatewayRoomTraceActions.ONLINE,
            payload: {
              user_id: user.id
            }
          };
          this.sendToRoom(ConversationPrefix.getRoomPrefix(joinRoomReq.room_id), GatewayRoomSubKeys.ROOM_TRACE, roomTrace);

          socket.on('disconnect', (socket) => {
            this.attendanceService.updateStatus(joinRoomReq.room_id, user.id, AttendanceStatus.OFFLINE).then();
            const roomTrace: GatewayRoomTraceRes = {
              action: GatewayRoomTraceActions.OFFLINE,
              payload: {
                user_id: user.id
              }
            };
            this.sendToRoom(ConversationPrefix.getRoomPrefix(joinRoomReq.room_id), GatewayRoomSubKeys.ROOM_TRACE, roomTrace);
          });
        } else {
          this._errorTraceSend(socket, { message: 'request join room is failed. please check your emit request' });
        }
      } else {
        this._errorTraceSend(socket, { message: 'cannot decode the token' });
        console.log('handleJoinRoom disconnected');
      }

    } catch (e) {
      this._errorTraceSend(socket, e);
      console.error(e);
    }

  }


  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@MessageBody() joinRoomReq: JoinRoomReq,
                        @ConnectedSocket() socket: Socket) {
    try {
      const user = await this.verify(socket);
      if (user) {
        console.log('handleLeaveRoom', joinRoomReq);
        if (joinRoomReq) {
          // const joinRoomReq: JoinRoomReq = JSON.parse(payload);
          if (joinRoomReq && joinRoomReq.room_id) {
            socket.leave(joinRoomReq.room_id.toString());
            this.attendanceService.updateStatus(joinRoomReq.room_id, user.id, AttendanceStatus.OFFLINE).then();
            const roomTrace: GatewayRoomTraceRes = {
              action: GatewayRoomTraceActions.OFFLINE,
              payload: {
                user_id: user.id
              }
            };
            this.server.to(joinRoomReq.room_id.toString()).emit(GatewayRoomSubKeys.ROOM_TRACE, roomTrace);
          }
        }
      } else {
        this._errorTraceSend(socket, { message: 'cannot decode the token' });
        console.log('handleJoinRoom disconnected');
      }

    } catch (e) {
      this._errorTraceSend(socket, e);
      console.error(e);
    }

  }

  afterInit(server: any): any {
    console.log('afterInit');
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      console.log("handleConnection",socket)
      this._errorTraceSubscribe(socket);
      const user = await this.verify(socket);
      if (user) {
        socket.join(GatewayRoomSubKeys.USER_MESSAGE + user.id);
        console.log('handleConnection verified');
      } else {
        this._errorTraceSend(socket, { message: 'cannot decode the token' });
        socket.disconnect();
        console.log('handleConnection disconnected');
      }
    } catch (e) {
      this._errorTraceSend(socket, e);
      this.sendToRoom(socket.handshake.headers.trace_thread + '_', GatewayRoomSubKeys.ERROR_CONNECTION, e);
      socket.disconnect();
      console.error('handleConnection', e);
    }
  }


  async handleDisconnect(socket: Socket) {
    try {
      const user = await this.verify(socket);
      if (user) {
        socket.leave(GatewayRoomSubKeys.USER_MESSAGE + user.id);
      }
    } catch (e) {
      console.error('handleDisconnect', e);
    }
  }

  private _errorTraceSubscribe(socket: Socket) {
    if (socket && socket.handshake && socket.handshake.query && socket.handshake.query.trace_thread) {
      socket.join(socket.handshake.query.trace_thread + '_');
    }
  }

  private _errorTraceSend(socket: Socket, message: any) {
    if (socket && socket.handshake && socket.handshake.query && socket.handshake.query.trace_thread && message) {
      this.sendToRoom(socket.handshake.query.trace_thread + '_', GatewayRoomSubKeys.ERROR_CONNECTION, message);
    }
  }

  sendToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }


  emit(event: string, data: any) {
    this.server.emit(event, data);
  }

  async verify(socket: Socket): Promise<User | undefined> {
    try {
      if (socket?.handshake?.query?.authorization) {
        return await this.jwtService.verifyAsync<User>(socket.handshake.query.authorization, { secret: process.env.JWT_SECRET_KEY });
      }
    } catch (e) {
      console.error('verify error', e);
      this._errorTraceSend(socket, e);
    }
    return undefined;
  }

}