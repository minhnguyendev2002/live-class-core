import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'attendance_histories' })
export default class AttendanceHistory {
  @PrimaryGeneratedColumn()
	id: number;
  @Column()
	class_schedule_id: number;
  @Column()
	user_id: number;
  @Column()
	check_type: string;
  @Column()
	class_id: number;
  @Column()
	note?: string;
  @UpdateDateColumn()
	updated_at: string;
  @CreateDateColumn()
	created_at: string;
}