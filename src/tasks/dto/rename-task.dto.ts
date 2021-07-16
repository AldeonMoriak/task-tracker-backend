import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class RenameTaskDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @IsNumber()
  id: number;
}
