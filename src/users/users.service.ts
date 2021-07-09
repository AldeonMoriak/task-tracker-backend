import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDTO } from './dto/signup-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/constants';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    users.map((user) => delete user.password);
    return users;
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async signup(signupUserDTO: SignupUserDTO): Promise<any> {
    const { email, name, password, username } = signupUserDTO;
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.username = username;

    try {
      await user.save();
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('این کاربر قبلا ثبت نام کرده است.');
      }
      throw new InternalServerErrorException();
    }

    return {
      message: 'عملیات موفقیت آمیز بود.',
    };
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(payload: LoginUserDTO) {
    const user = await this.findOne(payload.username);
    if (!user)
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است.');
    if (!user.isActive)
      throw new UnauthorizedException('حساب کاربری غیرفعال شده است');
    if (!(await user.validatePassword(payload.password)))
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است.');

    const info = { username: user.username, sub: user.id, isAdmin: true };
    return {
      message: 'عملیات با موفقیت انجام شد',
      access_token: this.jwtService.sign(info, {
        secret: jwtConstants.adminSecret,
        audience: 'admin',
      }),
    };
  }
}
