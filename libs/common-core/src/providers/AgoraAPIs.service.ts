import { Injectable } from '@nestjs/common';
import { ApiResponse, ApisauceInstance, create } from 'apisauce';
import { AgoraTokenService } from './AgoraToken.service';
import { AgoraWhiteBoardRoom } from '../models/AgoraWhiteBoard';

const WhiteBoardRegions = ['us-sv', 'sg', 'in-mum', 'gb-lon', 'cn-hz'];

@Injectable()
export class AgoraAPIsService {
  constructor(private agoraTokenService: AgoraTokenService) {

  }

  api = (region?: string): ApisauceInstance => {
    const token = this.agoraTokenService.generateSDKNetLessToken();
    if (!(region && WhiteBoardRegions.includes(region))) {
      region = 'sg';
    }
    return create({
      baseURL: 'https://api.netless.link/v5/',
      headers: { token: token, region: region },
    });
  };

  async getWhiteBoardRoom(uuid: string, region?: string): Promise<ApiResponse<AgoraWhiteBoardRoom>> {
    return await this.api(region).get<AgoraWhiteBoardRoom>(`rooms/${uuid}`);
  }

  async createWhiteBoardRoom(isRecord: boolean, region?: string): Promise<ApiResponse<AgoraWhiteBoardRoom>> {
    return await this.api(region).post<AgoraWhiteBoardRoom>(`rooms`, { isRecord: isRecord });
  }
}
