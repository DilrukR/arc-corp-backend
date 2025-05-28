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
    // Convert ID to number if it's a string
    const taskId = typeof id === 'string' ? parseInt(id, 10) : id;

    console.log('Updating task with ID:', taskId, typeof taskId);
    console.log('Update data:', updateTaskDto);

    // Verify numeric ID
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
      where: {
        status: 'ongoing',
      },
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
}
