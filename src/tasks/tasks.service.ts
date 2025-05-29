import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../db/entities/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../db/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new task
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  // Assign task to users
  async assignTask(taskId: number, userIds: number[]): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const users = await this.userRepository.findByIds(userIds);
    task.assignedTo = users;
    return this.taskRepository.save(task);
  }

  // Update task status or details
  async update(
    id: number | string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const taskId = typeof id === 'string' ? parseInt(id, 10) : id;

    console.log('Updating task with ID:', taskId, typeof taskId);
    console.log('Update data:', updateTaskDto);

    if (isNaN(taskId)) {
      throw new BadRequestException(`Invalid task ID: ${id}`);
    }

    const task = await this.taskRepository.preload({
      id: taskId, // Use converted number
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.assignedTo?.length) {
      task.assignedTo = await this.userRepository.findByIds(
        task.assignedTo.map((user) => user.id),
      );
    }

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignedTo', 'subtasks'] });
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.softDelete(id);
  }

  async getOngoingTasksCount(): Promise<number> {
    return await this.taskRepository.count({
      where: { status: 'in_progress' },
      relations: ['assignedTo'],
    });
  }

  async getOngoingTasksByDepartment(): Promise<
    {
      departmentId: number;
      departmentName: string;
      count: number;
    }[]
  > {
    return await this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.department', 'department')
      .select([
        'department.id as departmentId',
        'department.name as departmentName',
        'COUNT(task.id) as count',
      ])
      .where('task.status = :status', { status: 'ongoing' })
      .groupBy('department.id')
      .getRawMany();
  }

  async getTaskCountsByDepartment() {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.department', 'department')
      .select('department.name', 'departmentName')
      .addSelect('department.departmentId', 'departmentId')
      .addSelect(
        "COALESCE(SUM(CASE WHEN task.status = 'pending' THEN 1 ELSE 0 END), 0)",
        'pending',
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN task.status = 'in_progress' THEN 1 ELSE 0 END), 0)",
        'in_progress',
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN task.status = 'completed' THEN 1 ELSE 0 END), 0)",
        'completed',
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN task.status = 'cancelled' THEN 1 ELSE 0 END), 0)",
        'cancelled',
      )
      .where('task.deleted_at IS NULL')
      .groupBy('department.departmentId, department.name')
      .getRawMany();

    return result.map((item) => ({
      departmentId: item.departmentId,
      departmentName: item.departmentName,
      pending: parseInt(item.pending, 10),
      in_progress: parseInt(item.in_progress, 10),
      completed: parseInt(item.completed, 10),
      cancelled: parseInt(item.cancelled, 10),
    }));
  }
}
