import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ServicePackStatus } from './ServicePack.entity';
import { IsNotEmpty } from 'class-validator';

export enum ServicePackTransactionStatus {
  INITIATED = 'INITIATED',
  CONFIRMED = 'CONFIRMED',
  RECONCILED = 'RECONCILED',
  PAID = 'PAID',
  ACTIVATED = 'ACTIVATED',
  CANCELED = 'CANCELED',
}
@Entity({ name: 'service_pack_transactions' })
export class ServicePackTransaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  service_pack_id: number;
  @Column()
  @ApiProperty()
  user_id: number;
  @Column()
  @ApiProperty()
  creator: number;
  @Column()
  @ApiProperty()
  activated: Date;
  @Column()
  @ApiProperty()
  expiry: Date;
  @Column()
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ServicePackTransactionStatus,
    default: ServicePackTransactionStatus.INITIATED,
  })
  status: ServicePackTransactionStatus;
  @Column()
  @ApiProperty()
  class_number: number;
  @ApiProperty()
  @Column()
  attendant_number: number;
  @Column()
  @ApiProperty()
  day_number: number;
  @Column()
  @ApiProperty()
  teaching_time_number: number;
  @Column()
  @ApiProperty()
  note: string;
  @Column()
  @ApiProperty()
  coupon: string;
  @Column()
  @ApiProperty()
  promotion_amount: number;
  @Column()
  @ApiProperty()
  total_amount_due: number;
  @Column()
  @ApiProperty()
  refer: string;
  @Column()
  @ApiProperty()
  updated_at: Date;
  @Column()
  @ApiProperty()
  created_at: Date;
}


export class CreateServicePackTransaction {

  @IsNotEmpty()
  @ApiProperty()
  service_pack_id: number;


  @Column()
  @ApiProperty()
  note: string;
  @Column()
  @ApiProperty()
  coupon: string;

  @ApiProperty()
  refer: string;
}

export class ConfirmTransaction {

  @IsNotEmpty()
  @ApiProperty()
  id: number;

}

export class PayTransaction {

  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  otp: string;

}

export class ActivateTransaction {

  @IsNotEmpty()
  @ApiProperty()
  id: number;


}