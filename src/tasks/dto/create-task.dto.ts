import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsNumber()
  id: number;
}
