import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SubTask } from './subtasks.entity';
import { Department } from './departments.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  departmentId: number;

  @ManyToOne(() => Department, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  // Add start time
  @Column({ type: 'timestamp', nullable: true, name: 'start_time' })
  startTime: Date;

  // Add end time
  @Column({ type: 'timestamp', nullable: true, name: 'end_time' })
  endTime: Date;

  // Add link field
  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;

  @ManyToMany(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'assignments',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignedTo: User[];

  @OneToMany(() => SubTask, (subTask) => subTask.task, { cascade: true })
  subtasks: SubTask[];

  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
