import { IsNumber, IsDate } from 'class-validator';

export class EditTimeOfTaskDTO {
  @IsDate()
  time: Date;

  @IsNumber()
  id: number;
}
