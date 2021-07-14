import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class AddDescriptionDTO {
  @IsString()
  @MinLength(5)
  @MaxLength(140)
  content: string;

  @IsNumber()
  id: number;
}
