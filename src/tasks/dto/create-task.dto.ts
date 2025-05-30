import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsPositive,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export enum TaskCategory {
  FINANCE = 'Finance',
  IT = 'IT',
  PROCUREMENT = 'Procurement',
  CLEANING = 'Cleaning',
  LOGISTICS = 'Logistics',
  MISCELLANEOUS = 'Miscellaneous',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  departmentId: number;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsUrl()
  @IsOptional()
  link?: string;
}
