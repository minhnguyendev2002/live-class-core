import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Description, Endpoint } from '../../utils/constants';
import { DefaultHeaders, ServicePackHeader } from '../../utils/headers';
import { EditMessageTextReq, SendMessageReq } from '@app/common-core/models/mongo/Message';
import ConversationService from '@app/common-core/providers/Conversation.service';
import { Conversation } from '@app/common-core/models/mongo/Conversation';
import BaseController from '../../base.controller';
import { RabbitMQProducerService } from '@app/common-core/providers/RabbitMQProducer.service';
import { GatewayMicroservice } from '@app/common-core/models/Gateway.model';
import { ClassConversationsReq, RoomConversationsReq } from '../../utils/request';

@ApiTags(Endpoint.Conversation)
@Controller(Endpoint.Conversation)
@ApiBearerAuth()
export default class ConversationController extends BaseController {

  constructor(private readonly conversationService: ConversationService,
              private readonly rabbitMQProducerService: RabbitMQProducerService) {
    super();
  }

  @Post(':conversation_id/message')
  @ApiOperation({
    summary: 'Socket subscribed topics(events)',
    description: Description.ConversationSubscribedTopics
  })
  async sendMessage(@Headers() headers: DefaultHeaders, @Param('conversation_id') id: string, @Body() body: SendMessageReq) {
    const conversation = await this.conversationService.updateMessageFromMessageReq(JSON.parse(headers._user_data), id, body);
    if (conversation) {
      this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_CONVERSATION, conversation).then();
      const response = this.successRes();
      response.data = conversation;
      return response;
    } else {
      return this.internalServerErrorRes('maybe conversation invalid or participant invalid');
    }
  }

  @Delete(':conversation_id/message/:message_id')
  async deleteMessage(@Headers() headers: DefaultHeaders, @Param('conversation_id') conversationId: string, @Param('message_id') messageId: string) {
    const conversation = await this.conversationService.deleteMessage(conversationId, messageId, parseInt(headers._id));
    if (conversation) {
      await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_CONVERSATION, conversation);
      return this.successRes();
    } else {
      return this.internalServerErrorRes('maybe conversation invalid or participant invalid');
    }
  }

  @Put(':conversation_id/message/:message_id')
  async editMessage(@Headers() headers: DefaultHeaders, @Param('conversation_id') conversationId: string, @Param('message_id') messageId: string, @Body() body: EditMessageTextReq) {
    const conversation = await this.conversationService.editMessageTextFromReq(conversationId, messageId, parseInt(headers._id), body);
    if (conversation) {
      await this.rabbitMQProducerService.send(GatewayMicroservice.BROADCAST_CONVERSATION, conversation);
      return this.successRes();
    } else {
      return this.internalServerErrorRes('maybe conversation invalid or participant invalid');
    }
  }


  @Get('room')
  async getRoomConversation(@Headers() headers: DefaultHeaders, @Query() query: RoomConversationsReq) {
    const response = this.successRes();
    const data = await this.conversationService.getRoomConversations(query.room_id);
    response.data = data[0];
    response.total_record = data[1];
    return response;
  }


  @Get('me')
  async getConversations(@Headers() headers: DefaultHeaders) {
    const response = this.successRes();
    const data = await this.conversationService.getConversationsByUID(parseInt(headers._id));
    response.data = data[0];
    response.total_record = data[1];
    return response;
  }

  @Get('class')
  async getClassConversation(@Headers() headers: DefaultHeaders, @Query() query: ClassConversationsReq) {
    const response = this.successRes();
    const data = await this.conversationService.getClassConversations(query.class_id);
    response.data = data[0];
    response.total_record = data[1];
    return response;
  }

  @Get(':conversation_id/messages')
  async getMessage(@Headers() headers: DefaultHeaders, @Query('conversation_id') id: string) {
    const response = this.successRes();
    const data = await this.conversationService.getMessages(id);
    response.data = data[0];
    response.total_record = data[1];
    return response;
  }

}