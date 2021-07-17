import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/interfaces/current-user.interface';
import { LoginResponse } from 'src/interfaces/login.interface';
import { ResponseMessage } from 'src/interfaces/response-message.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { SignupUserDTO } from './dto/signup-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/login')
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<LoginResponse> {
    return this.usersService.login(loginUserDTO);
  }

  @Post('auth/signup')
  async signup(@Body() signupUserDTO: SignupUserDTO): Promise<LoginResponse> {
    return this.usersService.signup(signupUserDTO);
  }

  @Post('profile/updateProfile')
  async updateProfile(
    @GetUser() currentUser: CurrentUser,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<ResponseMessage> {
    return this.usersService.updateProfile(currentUser, updateProfileDTO);
  }

  @Get('profile/getProfile')
  async getProfile(@GetUser() currentUser: CurrentUser): Promise<User> {
    return this.usersService.getProfile(currentUser);
  }
}
