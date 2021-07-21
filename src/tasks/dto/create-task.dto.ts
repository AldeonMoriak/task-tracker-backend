import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @IsNumber()
  parentId: number;

  @IsNumber()
  id: number;
}
