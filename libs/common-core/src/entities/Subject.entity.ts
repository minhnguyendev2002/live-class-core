import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'short_links' })
export default class Subject {
  @PrimaryGeneratedColumn()
	id: number;
  @Column()
	name: string;
  @Column()
	descriptions: string;
  @Column()
	total_duration: number;
  @Column()
	creator: number;
  @UpdateDateColumn()
	updated_at: string;
  @CreateDateColumn()
	created_at: string;
}