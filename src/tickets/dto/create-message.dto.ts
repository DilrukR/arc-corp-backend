import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  isInternalNote?: boolean = false;
}
