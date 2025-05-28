import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index, // Add this for performance
} from 'typeorm';
import { User } from './user.entity';

@Entity('departments')
@Index(['name']) // Add index for faster queries on department name
export class Department {
  @PrimaryGeneratedColumn()
  departmentId: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 500 }) // Add length constraint
  description: string;

  @Column({ default: true })
  @Index() // Index for filtering active/inactive departments
  isActive: boolean;

  @OneToMany(() => User, (user) => user.department, {
    cascade: false, // Explicitly set cascade behavior
    lazy: true, // Load users only when accessed
  })
  users: User[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone', // Better timezone handling
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  // Optional: Add a method to get active users count
  @Column({ default: 0 })
  userCount: number;
}
