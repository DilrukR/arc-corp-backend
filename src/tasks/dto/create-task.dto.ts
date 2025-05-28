import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsPositive,
  IsNumber,
} from 'class-validator';

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

  @IsNumber()
  @IsPositive()
  departmentId: number;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsOptional()
  @IsDateString()
  deadline?: Date;
}
