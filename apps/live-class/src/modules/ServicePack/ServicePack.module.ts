import { Module } from '@nestjs/common';
import { ServicePackController } from './ServicePack.controller';
import { ServicePackService } from '@app/common-core/providers/ServicePack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from '@app/common-core/entities/ServicePack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePack])],
  controllers: [ServicePackController],
  providers: [ServicePackService],
})
export class ServicePackModule {}
