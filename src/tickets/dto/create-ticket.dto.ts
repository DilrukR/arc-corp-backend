import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { TicketCategory } from '../../db/enums/ticket-category.enum';

export class CreateTicketDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TicketCategory)
  category: TicketCategory;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;
}
