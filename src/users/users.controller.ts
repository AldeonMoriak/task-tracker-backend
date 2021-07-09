import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO } from './dto/login-user.dto';
import { SignupUserDTO } from './dto/signup-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/login')
  async login(@Body() loginUserDTO: LoginUserDTO) {
    return this.usersService.login(loginUserDTO);
  }

  @Post('auth/signup')
  async signup(@Body() signupUserDTO: SignupUserDTO): Promise<any> {
    return this.usersService.signup(signupUserDTO);
  }
}
