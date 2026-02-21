import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from './create-task.dto';

export class FilterTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
