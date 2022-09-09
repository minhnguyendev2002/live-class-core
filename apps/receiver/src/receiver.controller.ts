import { Controller, Get } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  GatewayMicroservice,
  GatewayRoomControlReq, GatewayRoomInteractionActions,
  GatewayRoomInteractionReq,
  GatewayRoomSubKeys, GatewayUserPushMessage
} from '@app/common-core/models/Gateway.model';
import { EventsGateway } from './events.gateway';
import { RoomAutoRollCallReq, RoomRollCallReq } from '../../live-class/src/utils/request';
import { TaskRollCallService } from './services/TaskRollCall.service';
import RollCall from '@app/common-core/entities/RollCall.entity';
import { Conversation } from '@app/common-core/models/mongo/Conversation';
import { ConversationPrefix } from '@app/common-core/util/Constant';
import Notification from '@app/common-core/entities/Notification.entity';
import Room from '@app/common-core/entities/Room.entity';

@Controller()
export class ReceiverController {
  constructor(private readonly eventsGateway: EventsGateway, private readonly taskRollCallService: TaskRollCallService) {
  }

  @MessagePattern(GatewayRoomSubKeys.ROOM_INTERACTION)
  public roomInteraction(
    @Payload() data: GatewayRoomInteractionReq,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    this.eventsGateway.sendToRoom(ConversationPrefix.getRoomPrefix(data.room_id), GatewayRoomSubKeys.ROOM_INTERACTION, data);
    channel.ack(originalMessage);
  }

  @MessagePattern(GatewayRoomSubKeys.ROOM_CONTROL)
  public roomControl(
    @Payload() data: GatewayRoomControlReq,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    this.eventsGateway.sendToRoom(ConversationPrefix.getRoomPrefix(data.room_id), GatewayRoomSubKeys.ROOM_CONTROL, data);
    channel.ack(originalMessage);
  }

  @MessagePattern(GatewayMicroservice.ACTIVE_AUTO_ROLL_CALL)
  public autoRollCall(
    @Payload() data: RoomAutoRollCallReq,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    this.taskRollCallService.addAutoRollCallJob(data.user, data.room_id).then();
    channel.ack(originalMessage);
  }

  @MessagePattern(GatewayMicroservice.ACTIVE_ROLL_CALL)
  public rollCall(
    @Payload() data: RoomRollCallReq,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    this.taskRollCallService.startRollCallByManyAttendants(data, data.attendant_user_ids).then();
  }

  @MessagePattern(GatewayMicroservice.VERIFY_ROLL_CALL)
  public verifyRollCall(
    @Payload() data: RollCall,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const request: GatewayRoomInteractionReq = {
      room_id: data.room_id,
      action: GatewayRoomInteractionActions.VERIFIED_ROLL_CALL,
      payload: {
        roll_call_id: data.id,
        user_id: data.user_id
      }
    };
    this.eventsGateway.sendToRoom(ConversationPrefix.getRoomPrefix(data.room_id), GatewayRoomSubKeys.ROOM_INTERACTION, request);
    channel.ack(originalMessage);
  }

  @MessagePattern(GatewayMicroservice.BROADCAST_CONVERSATION)
  public broadcastConversation(
    @Payload() data: Conversation,
    @Ctx() context: RmqContext
  ) {
    console.log('mess');
    
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    console.log(data.participants, 'data.participants');
    
    if (data.participants && data.participants.length) {
      data.participants.map((item) => {
        this.eventsGateway.sendToRoom(GatewayRoomSubKeys.USER_MESSAGE + item, GatewayUserPushMessage.PUSH_MESSAGE, data);
      });
    }

    channel.ack(originalMessage);
  }


  @MessagePattern(GatewayMicroservice.BROADCAST_NOTIFICATION)
  public broadcastNotification(
    @Payload() data: Notification,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    if (data.user_id) {
      this.eventsGateway.sendToRoom(GatewayRoomSubKeys.USER_MESSAGE + data.user_id, GatewayRoomSubKeys.NOTIFICATION, data);
    }

  }


  @MessagePattern(GatewayMicroservice.END_ROOM)
  public endRoom(
    @Payload() data: Room,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    this.taskRollCallService.endRoom(data).then();

  }
}
