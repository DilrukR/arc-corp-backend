import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsPositive()
  taskId: number;

  @IsNumber()
  @IsPositive()
  userId: number;
}

// src/comments/dto/update-comment.dto.ts
