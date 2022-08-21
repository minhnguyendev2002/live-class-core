import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ParseIntPipe } from '@nestjs/common';

export enum ServicePackStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DISABLED = 'DISABLED',
}

@Entity({ name: 'service_packs' })
export class ServicePack {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  slash_price: number;

  @ApiProperty()
  @Column()
  class_number: number;

  @ApiProperty()
  @Column()
  attendant_number: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ServicePackStatus,
    default: ServicePackStatus.DRAFT
  })
  status: ServicePackStatus;

  @Column()
  @ApiProperty()
  day_number: number;

  @ApiProperty()
  @Column({type:'json'})
  extra_data: ServicePackExtra;


  @Column()
  @ApiProperty()
  teaching_time_number: number;

  @Column({ type: 'longtext' })
  @ApiProperty()
  description?: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  @Column()
  creator: number;

}

export interface ServicePackExtra {
  short_des: string[]
}

export class ServicePackItem extends ServicePack {
  @ApiProperty()
  purchase_number: number;
}

export class CreateServicePack {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @ApiProperty({
    description: 'Actual value, after taxes, fees, promotions, etc.'
  })
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  @ApiProperty({ description: 'Listed price, before taxes, fee, promotions' })
  slash_price: number;
  @ApiProperty()
  @IsNotEmpty()
  class_number: number;
  @ApiPropertyOptional()
  extra_data: ServicePackExtra;
  @ApiPropertyOptional()
  teaching_time_number: number;
  @ApiPropertyOptional()
  attendant_number: number;
  creator: number;
  @ApiProperty({
    description: 'Utilization time'
  })
  day_number: number;
  @ApiPropertyOptional()
  description: string;
}

export class UpdateServicePack {
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  teaching_time_number: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @ApiPropertyOptional({
    description: 'Actual value, after taxes, fees, promotions, etc.'
  })

  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  @ApiProperty({ description: 'Listed price, before taxes, fee, promotions' })
  slash_price: number;
  @ApiProperty()
  @IsNotEmpty()
  class_number: number;
  @ApiPropertyOptional()
  attendant_number: number;

  @ApiPropertyOptional()
  extra_data: ServicePackExtra;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Utilization time'
  })
  day_number: number;
  @ApiPropertyOptional()
  description: string;
}


export class ListQueryBuyingServicePack {

  @ApiProperty()
  @ApiPropertyOptional()
  search: string;
  @ApiPropertyOptional()
  @ApiProperty()
  page: number;
  @ApiProperty()
  @ApiPropertyOptional()
  page_size: number;

  @ApiPropertyOptional()
  sort: string;

}

export class ListQueryServicePack {

  @ApiProperty()
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional({type:Number})
  page: number;

  @ApiPropertyOptional({type:Number})
  page_size: number;

  status: ServicePackStatus;

  @ApiProperty()
  @ApiPropertyOptional()
  teaching_time_number: number;

  price: number;
  @ApiPropertyOptional()
  @ApiProperty({ description: 'Listed price, before taxes, fee, promotions' })
  slash_price: number;
  @ApiPropertyOptional()
  @ApiProperty()
  class_number: number;
  creator: number;
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Utilization time'
  })
  @ApiPropertyOptional()
  day_number: number;

  @ApiProperty({
    description: 'Field DESC,ESC (e.g: day_number DESC, class_number ASC)'
  })
  @ApiPropertyOptional()
  sort: string;

}

export class UpdateServicePackStatus {

  @ApiProperty()
  id: number;

  @ApiProperty({ enum: [ServicePackStatus.DISABLED, ServicePackStatus.PUBLISHED] })
  status: ServicePackStatus;

}



