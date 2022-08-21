import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'timetables' })
export default class Timetable {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	start_at: string;
	@Column()
	end_at: string;
	@Column()
	class_id: number;
	@Column()
	host: number;
	@Column()
	subject_id: number;
	@Column()
	creator: number;
	@UpdateDateColumn()
	updated_at: string;
	@CreateDateColumn()
	created_at: string;
}