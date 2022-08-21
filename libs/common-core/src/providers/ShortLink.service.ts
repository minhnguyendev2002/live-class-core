import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ShortLink, { Permission, ShortLinkAction } from '@app/common-core/entities/ShortLink.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class ShortLinkService {
  constructor(
    @InjectRepository(ShortLink)
    private shortLinkRepository: Repository<ShortLink>
  ) {
  }

  async getShortLink(nanoId: string): Promise<ShortLink> {
    return await this.shortLinkRepository.findOne({ nano_id: nanoId });
  }

  async getJoinRoomShortLink(nanoId: string): Promise<ShortLink> {
    return await this.shortLinkRepository.findOne({ nano_id: nanoId, action: ShortLinkAction.JOIN_ROOM });
  }

  async generateForRoom(room_id: number): Promise<ShortLink> {
    const shortLink = await this.shortLinkRepository.findOne({ room_id: room_id, action: ShortLinkAction.JOIN_ROOM });
    if (shortLink) {
      return shortLink;
    } else {
      let nanoId = nanoid(10);
      let shortLink = await this.shortLinkRepository.findOne({ nano_id: nanoId });
      while (shortLink) {
        nanoId = nanoid(10);
        shortLink = await this.shortLinkRepository.findOne({ nano_id: nanoId });
      }
      return await this.shortLinkRepository.save({
        nano_id: nanoId,
        action: ShortLinkAction.JOIN_ROOM,
        permission: Permission.EDIT,
        room_id: room_id
      });
    }
  }
}