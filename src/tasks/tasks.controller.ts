import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post(':id/assign')
  assignTask(@Param('id') taskId: number, @Body() userIds: number[]) {
    return this.tasksService.assignTask(taskId, userIds);
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
}
