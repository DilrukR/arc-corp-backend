// src/comments/comments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('task/:taskId')
  async findByTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.commentsService.findByTask(taskId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Query('userId', ParseIntPipe) userId: number, // In real app, get from JWT token
  ) {
    return this.commentsService.update(id, updateCommentDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number, // In real app, get from JWT token
  ) {
    return this.commentsService.remove(id, userId);
  }

  @Get('task/:taskId/count')
  async getCommentsCount(@Param('taskId', ParseIntPipe) taskId: number) {
    const count = await this.commentsService.getCommentsCount(taskId);
    return { count };
  }
}
