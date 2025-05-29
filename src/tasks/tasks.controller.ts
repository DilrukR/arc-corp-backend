import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post(':id/assign')
  @UsePipes(new ValidationPipe({ transform: true }))
  assignTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.tasksService.assignTask(taskId, assignTaskDto.userIds);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('ongoing/count')
  getOngoingTasksCount() {
    return this.tasksService.getOngoingTasksCount();
  }

  @Get('ongoing/departments')
  getOngoingTasksByDepartment() {
    return this.tasksService.getOngoingTasksByDepartment();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }

  @Get('department-wise-count')
  getTaskCountsByDepartment() {
    return this.tasksService.getTaskCountsByDepartment();
  }

  @Get('task-by-department/:departmentId')
  getTasksByDepartment(@Param('departmentId') departmentId: number) {
    return this.tasksService.getTasksByDepartment(departmentId);
  }

  @Get('user-tasks/:userId')
  getTasksByUserId(@Param('userId') userId: number) {
    return this.tasksService.getTasksByUser(userId);
  }
}
