import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
