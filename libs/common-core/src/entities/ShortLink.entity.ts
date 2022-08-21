import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'short_links' })
export default class ShortLink {
  @PrimaryGeneratedColumn()
	id: number;
  @Column()
	nano_id: string;
  @Column()
	action: ShortLinkAction;
  @Column()
	room_id: number;
  @Column()
	permission: Permission;
  @UpdateDateColumn()
	updated_at: string;
  @CreateDateColumn()
	created_at: string;
}

export enum ShortLinkAction{
  JOIN_ROOM="JOIN_ROOM",
  SHARE_DOCUMENT="SHARE_DOCUMENT",
}
export enum Permission{
  VIEW="VIEW",
  EDIT="EDIT",
}
