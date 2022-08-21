import { Module } from '@nestjs/common';
import { ServicePackTransactionController } from './ServicePackTransaction.controller';
import { ServicePackService } from '../../../../../libs/common-core/src/providers/ServicePack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from '../../../../../libs/common-core/src/entities/ServicePack.entity';
import { ServicePackTransactionService } from '../../../../../libs/common-core/src/providers/ServicePackTransaction.service';
import { ServicePackTransaction } from '../../../../../libs/common-core/src/entities/ServicePackTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePack,ServicePackTransaction])],
  controllers: [ServicePackTransactionController],
  providers: [ServicePackService,ServicePackTransactionService],
})
export class ServicePackTransactionModule {}
