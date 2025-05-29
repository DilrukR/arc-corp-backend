// assign-task.dto.ts
import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';

export class AssignTaskDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  userIds: number[];
}
