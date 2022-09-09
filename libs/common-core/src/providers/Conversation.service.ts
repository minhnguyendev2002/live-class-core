import { Injectable } from '@nestjs/common';
import { Conversation, ConversationDocument } from '@app/common-core/models/mongo/Conversation';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { RoomService } from '@app/common-core/providers/Room.service';
import {
  EditMessageTextReq,
  Message,
  MessageDocument,
  MessageType,
  SendMessageReq,
} from '@app/common-core/models/mongo/Message';
import { ClassService } from '@app/common-core/providers/Class.service';
import { UnreadDocument, UnreadMessage } from '@app/common-core/models/mongo/UnreadMessage';
import { ConversationPrefix } from '@app/common-core/util/Constant';
import * as uuid from 'uuid';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';
import User from '@app/common-core/entities/User.entity';


@Injectable()
export default class ConversationService {


  constructor(@InjectModel(Conversation.name) private conversationDocumentModel: Model<ConversationDocument>,
              @InjectModel(Message.name) private messageDocumentModel: Model<MessageDocument>,
              @InjectModel(UnreadMessage.name) private unreadDocumentModel: Model<UnreadDocument>,
              private readonly roomService: RoomService,
              private readonly classService: ClassService) {
  }

  async create(conversation: Conversation): Promise<Conversation> {
    const create = new this.conversationDocumentModel(conversation);
    return await create.save();
  }

  async update(conversation: Conversation): Promise<Conversation> {
    await this.conversationDocumentModel.updateOne({ conversation_id: conversation.conversation_id }, conversation).exec();
    return this.conversationDocumentModel.findOne({ conversation_id: conversation.conversation_id }).exec();
  }

  async createConversationFromRoomId(roomId: number,user:User): Promise<Conversation> {
    const room = await this.roomService.findOneById(roomId);

    const conversation: Conversation = {
      conversation_id: ConversationPrefix.getRoomPrefix(roomId),
      name: room.name,
      room_id: roomId,
      class_id: room.class_id,
      participants: [room.creator],
      host: room.creator,
      sender: user,
      message_count: 1,
    };
    let saved = await (new this.conversationDocumentModel(conversation).save());
    const message: Message = {
      conversation_id: saved.conversation_id,
      room_id: roomId,
      class_id: room.class_id,
      sender: user,
      type: MessageType.CREATED_GROUP,
      read_by: [],
      text: '',
      host: room.creator,
      attachments: [],
    };
    saved.message = await (new this.messageDocumentModel(message).save());
    await this.conversationDocumentModel.updateOne({ conversation_id: saved.conversation_id }, saved).exec();
    this.upsertUnreadMessageForJoin(saved.conversation_id, room.creator, 0).then();
    return saved;
  }

  async createConversationFromClassId(classId: number): Promise<Conversation> {
    const cl = await this.classService.findOneById(classId);

    const conversation: Conversation = {
      conversation_id: ConversationPrefix.getClassPrefix(classId),
      name: cl.name,
      room_id: 0,
      class_id: classId,
      participants: [cl.creator],
      host: cl.creator,
      sender: {
        id: cl.creator,
      },
      message_count: 1,
    };
    let saved = await (new this.conversationDocumentModel(conversation).save());
    const message: Message = {
      conversation_id: saved.conversation_id,
      room_id: 0,
      class_id: classId,
      sender: {
        id: cl.creator,
      },
      type: MessageType.CREATED_GROUP,
      read_by: [],
      text: '',
      host: cl.creator,
      attachments: [],
    };
    saved.message = await (new this.messageDocumentModel(message).save());
    await this.conversationDocumentModel.updateOne({ conversation_id: saved.conversation_id }, saved).exec();
    this.upsertUnreadMessageForJoin(saved.conversation_id, cl.creator, 0).then();
    return saved;
  }

  async joinGroup(conversationId: string, uid: number): Promise<Conversation> {
    let conversation = await this.conversationDocumentModel.findOne({ conversation_id: conversationId }).exec();
    const message: Message = {
      conversation_id: conversationId,
      room_id: conversation.room_id,
      class_id: conversation.class_id,
      sender: {
        id: uid,
      },
      type: MessageType.JOIN_GROUP,
      read_by: [],
      text: '',
      host: conversation.host,
      attachments: [],
    };
    conversation.message_count = conversation.message_count + 1;
    if (!(conversation.participants && conversation.participants.includes(uid))) {
      if (!conversation.participants) {
        conversation.participants = [];
      }
      conversation.participants.push(uid);
      conversation.message = await (new this.messageDocumentModel(message).save());
      await this.conversationDocumentModel.updateOne({ conversation_id: conversation.conversation_id }, conversation).exec();
    }
    return conversation;
  }

  async upsertUnreadMessageAdd1(conversationId: string, senderId: number) {
    const updateMine = async () => {
      const unreadMessage: UnreadMessage = {
        conversation_id: conversationId,
        user_id: senderId,
        unread_count: 0,
      };
      await this.unreadDocumentModel.updateOne({
        conversation_id: conversationId,
        user_id: senderId,
      }, unreadMessage, { new: true, upsert: true }).exec();
    };
    const unreadMessages = await this.unreadDocumentModel.find({ conversation_id: conversationId }).exec();
    if (unreadMessages && unreadMessages.length) {
      unreadMessages.filter(x => x.user_id !== senderId).map(async (item) => {
        item.unread_count = item.unread_count + 1;
        await this.unreadDocumentModel.updateOne({
          conversation_id: item.conversation_id,
          user_id: item.user_id,
        }, item).exec();
      });
      updateMine().then();
    } else {
      updateMine().then();
    }

  }

  async upsertUnreadMessageForJoin(conversationId: string, senderId: number, count: number) {
    const unreadMessage: UnreadMessage = {
      conversation_id: conversationId,
      user_id: senderId,
      unread_count: count,
    };
    return await new this.unreadDocumentModel(unreadMessage).save();
  }

  async updateMessageFromMessageReq(sender: User, conversationId: string, request: SendMessageReq): Promise<Conversation | undefined> {
    const conversation = await this.conversationDocumentModel.findOne({ conversation_id: conversationId }).exec();
    // if (conversation && conversation.participants && conversation.participants.length && conversation.participants.find(x => x === sender.id)) {
      if (conversation && conversation.participants && conversation.participants.length) {
      
      let attachments = request.attachments;
      console.log(attachments, 'attachments');
      
      if (attachments && attachments.length) {
        attachments = attachments.map((item) => {
          if (!item.id) {
            item.id = uuid.v4();
          }
          return item;
        });
      }
      const message: Message = {
        conversation_id: conversation.conversation_id,
        text: request.text,
        attachments: attachments,
        sender: sender,
        read_by: [],
        host: conversation.host,
        type: MessageType.MESSAGE,
        class_id: conversation.class_id,
        room_id: conversation.room_id,
      };
      conversation.message = await new this.messageDocumentModel(message).save();
      conversation.sender = sender;
      this.upsertUnreadMessageAdd1(conversationId, sender.id).then();
      return await this.conversationDocumentModel.findOneAndUpdate({ conversation_id: conversationId }, conversation, { new: true }).exec();
    }
    return undefined;
  }

  async deleteMessage(conversationId: string, messageId: string, senderId: number): Promise<Conversation | undefined> {
    const conversation = await this.conversationDocumentModel.findOne({ conversation_id: conversationId }).exec();
    if (conversation && conversation.participants && conversation.participants.length && conversation.participants.find(x => x === senderId)) {
      const message = await this.messageDocumentModel.findOne({ _id: new Types.ObjectId(messageId) }).exec();
      if (message) {
        conversation.message = message;
        await this.messageDocumentModel.deleteOne({ _id: new Types.ObjectId(messageId) }).exec();
        if (conversation.message._id.toString() === messageId) {
          conversation.message = await this.messageDocumentModel.findOne({}).sort({ date: -1 }).exec();
          return await this.conversationDocumentModel.findOneAndUpdate({ conversation_id: conversationId }, conversation, { new: true }).exec();
        }
        return conversation;
      }

    }
    return undefined;
  }

  async editMessageTextFromReq(conversationId: string, messageId: string, senderId: number, request: EditMessageTextReq): Promise<Conversation | undefined> {
    const conversation = await this.conversationDocumentModel.findOne({ conversation_id: conversationId }).exec();
    if (conversation && conversation.participants && conversation.participants.length && conversation.participants.find(x => x === senderId)) {
      const message = await this.messageDocumentModel.findOne({ _id: new Types.ObjectId(messageId) }).exec();
      if (message) {
        message.text = request.text;
        conversation.message = await this.messageDocumentModel.findOneAndUpdate({ _id: messageId }, message, { new: true }).exec();
        return await this.conversationDocumentModel.findOneAndUpdate({ conversation_id: conversationId }, conversation, { new: true }).exec();
      }
    }
    return undefined;
  }


  async getRoomConversations(roomId: number): Promise<[Conversation[], number]> {
    const conversations = await this.conversationDocumentModel.find({ room_id: roomId }).exec();
    const count = await this.conversationDocumentModel.count({ room_id: roomId }).exec();
    return [conversations, count];
  }

  async getConversationsByUID(id: number): Promise<[Conversation[], number]> {
    const conversations = await this.conversationDocumentModel.find({ participants: id }).exec();
    const count = await this.conversationDocumentModel.count({ participants: id }).exec();
    return [conversations, count];
  }


  async getClassConversations(classId: number): Promise<[Conversation[], number]> {
    const conversations = await this.conversationDocumentModel.find({ class_id: classId }).exec();
    const count = await this.conversationDocumentModel.count({ class_id: classId }).exec();
    return [conversations, count];
  }

  async getMessages(conversationId: string): Promise<[Message[], number]> {
    const messages = await this.messageDocumentModel.find({ conversation_id: conversationId }).exec();
    const count = await this.messageDocumentModel.count({ conversation_id: conversationId }).exec();
    return [messages, count];
  }


}