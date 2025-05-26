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
} from 'typeorm';
import { User } from './user.entity'; // Assume User entity exists
import { SubTask } from './subtasks.entity'; // Optional for subtasks

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: [
      'Finance',
      'IT',
      'Procurement',
      'Cleaning',
      'Logistics',
      'Miscellaneous',
    ],
    nullable: false,
  })
  category: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  // Many-to-Many: Tasks can be assigned to multiple users
  @ManyToMany(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'assignments', // Join table name
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignedTo: User[];

  // One-to-Many: A task can have multiple subtasks (optional)
  @OneToMany(() => SubTask, (subTask) => subTask.task, { cascade: true })
  subtasks: SubTask[];

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // Soft delete
  deletedAt: Date;
}
