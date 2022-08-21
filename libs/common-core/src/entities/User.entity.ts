import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ServicePackStatus } from '@app/common-core/entities/ServicePack.entity';
import { Prop } from '@nestjs/mongoose';

export enum UserRole{
  HOST='HOST',
  USER='USER',
}

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  @Prop()
	id?: number;
  @ApiProperty()
  @Prop()
  @Column()
	username?: string;
  @Prop()
  @ApiProperty()
  @Column()
	full_name?: string;
  @Prop()
  @ApiProperty()
  @Column()
  email?: string;
  @Prop()
  @ApiProperty()
  @Column()
  phone_number?: string;
  @Prop()
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
  })
	role?: UserRole;
  @UpdateDateColumn()
	updated_at?: string;
  @CreateDateColumn()
	created_at?: string;

  token?: string;
}

export class UserQuickRegisterReq {
  @ApiProperty()
  full_name: string;
  @ApiProperty({enum:[UserRole.USER,UserRole.HOST]})
  role: UserRole;
}


