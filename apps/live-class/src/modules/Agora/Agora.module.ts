import { Module } from '@nestjs/common';
import AgoraController from './Agora.controller';
import { AgoraTokenService } from '@app/common-core/providers/AgoraToken.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgoraAPIsService } from '@app/common-core/providers/AgoraAPIs.service';
import { RoomService } from '@app/common-core/providers/Room.service';
import Room from '../../../../../libs/common-core/src/entities/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [AgoraController],
  providers: [
    AgoraTokenService,
    AgoraAPIsService,
    RoomService
  ]
})
export default class AgoraModule {

}