import { Injectable } from '@nestjs/common';
import { AgoraTokenRequest } from '../../../../apps/live-class/src/utils/request';
import { RtcTokenBuilder, RtmRole, RtmTokenBuilder } from 'agora-access-token';
import { roomToken, sdkToken, TokenRole } from 'netless-token';
import Rtm_User = RtmRole.Rtm_User;

@Injectable()
export class AgoraTokenService {
  generateRTCToken(request: AgoraTokenRequest): string {

    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    return RtcTokenBuilder.buildTokenWithUid(process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE, request.channel_name, 0, request.role, privilegeExpiredTs);
  }

  generateRoomNetLessToken(role: TokenRole, room_uuid: string): string {
    const expirationTimeInSeconds = 86400;
    return roomToken(process.env.AGORA_APP_AK, process.env.AGORA_APP_SK, expirationTimeInSeconds, {
      role: role,
      uuid: room_uuid
    });
  }

  generateSDKNetLessToken(): string {
    const expirationTimeInSeconds = 86400;
    return sdkToken(process.env.AGORA_APP_AK, process.env.AGORA_APP_SK, expirationTimeInSeconds, {
      role: TokenRole.Admin
    });
  }

  generateRTMToken(uid: string | number): string {
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    return RtmTokenBuilder.buildToken(process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE, uid, Rtm_User, privilegeExpiredTs);
  }
}