import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './tasks.entity';
import { Department } from './departments.entity';
import { Ticket } from './ticket.entity';
import { TicketMessage } from './ticket-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'employee' })
  role: 'admin' | 'manager' | 'employee';

  // Add the missing departmentId column
  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  createdTickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  assignedTickets: Ticket[];

  @ManyToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];
}
