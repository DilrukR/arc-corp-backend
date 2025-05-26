import { IsEnum, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export enum TaskCategory {
  FINANCE = 'Finance',
  IT = 'IT',
  PROCUREMENT = 'Procurement',
  CLEANING = 'Cleaning',
  LOGISTICS = 'Logistics',
  MISCELLANEOUS = 'Miscellaneous',
}

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsOptional()
  @IsDateString()
  deadline?: Date;
}
