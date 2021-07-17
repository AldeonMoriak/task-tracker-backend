import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupUserDTO {
  @IsNotEmpty({ message: 'یک نام کابری وارد کنید' })
  @IsString({ message: 'نام کاربری باید از نوع رشته باشد.' })
  @MinLength(5, { message: 'نام کاربری باید بیشتر از ۵ حرف باشد' })
  @MaxLength(12, { message: 'نام کاربری باید کمتر از ۱۲ حرف باشد' })
  username: string;

  @IsNotEmpty({ message: 'یک رمز وارد کنید.' })
  @IsString({ message: 'رمز عبور باید به صورت رشته باشد' })
  @MinLength(8, { message: 'نام کاربری باید بیشتر از ۸ حرف باشد.' })
  @MaxLength(20, { message: 'نام کابری باید کمتر از ۲۰ حرف باشد' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'رمز عبور بسیار ضعیف است و باید متشکل از یک حرف بزرگ، یک عدد و یک علامت باشد.',
  })
  password: string;
}
