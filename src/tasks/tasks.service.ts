import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/interfaces/current-user.interface';
import { ResponseMessage } from 'src/interfaces/response-message.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DateEntity } from './date.entity';
import { Task } from './task.entity';
import { Timesheet } from './timesheet.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepositiory: Repository<Task>,
    @InjectRepository(DateEntity)
    private dateRepository: Repository<DateEntity>,
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>,
    private userService: UsersService,
  ) {}

  // TODO
  // AddTimeToTask() checks if checkIn exists
  // editTimeOfTask(id, time)
  // getLimitOfTimeEditing(id) before editingTimeOfTask
  // getTodayTasks()

  async createTask(
    currentUser: CurrentUser,
    title: string,
    parentId: number,
  ): Promise<ResponseMessage> {
    const task = new Task();
    task.title = title;
    if (parentId) {
      const parent = await this.tasksRepositiory.findOne({ id: parentId });
      if (!parent) {
        throw new NotFoundException('تسک مورد نظر یافت نشد.');
      }
      task.parent = parent;
    }
    const user = await this.userService.findOne(currentUser.username);
    task.user = user;

    try {
      task.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async renameTask(
    currentUser: CurrentUser,
    id: number,
    title: string,
  ): Promise<ResponseMessage> {
    const task = await this.tasksRepositiory.findOne({ id });
    if (!task) {
      throw new NotFoundException('تسک مورد نظر یافت نشد');
    }
    const user = await this.userService.findOne(currentUser.username);
    if (task.user.username !== user.username) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    }
    task.title = title;
    try {
      task.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async deleteTask(
    currentUser: CurrentUser,
    id: number,
  ): Promise<ResponseMessage> {
    const task = await this.tasksRepositiory.findOne({ id });
    if (!task) {
      throw new NotFoundException('تسک مورد نظر یافت نشد.');
    }
    const user = await this.userService.findOne(currentUser.username);
    if (task.user.username !== user.username) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    }
    try {
      this.tasksRepositiory.delete({ id });
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async addDescriptionToTask(
    currentUser: CurrentUser,
    id: number,
    content: string,
  ): Promise<ResponseMessage> {
    const task = await this.tasksRepositiory.findOne({ id });
    if (!task) {
      throw new NotFoundException('تسک مورد نظر یافت نشد');
    }
    const user = await this.userService.findOne(currentUser.username);
    if (!user || user.username !== task.user.username) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید.');
    }
    task.description = content;

    try {
      task.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async check(
    currentUser: CurrentUser,
  ): Promise<ResponseMessage & { time: Timesheet }> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    }

    const lastCheck = await this.timesheetRepository.findOne({
      order: {
        date: 'DESC',
      },
      where: {
        user,
      },
    });

    const task = await this.tasksRepositiory.findOne({
      order: {
        date: 'DESC',
      },
      where: {
        user: user.username,
        isTicking: true,
      },
    });

    const time = new Timesheet();
    time.isCheckIn = lastCheck ? !lastCheck.isCheckIn : true;
    if (!time.isCheckIn && task) {
      task.isTicking = false;
      const date = new DateEntity();
      date.isBeginning = false;
      date.task = task;
      try {
        date.save();
      } catch (error) {
        console.log(error);
      }
    }
    time.user = user;
    try {
      time.save();
    } catch (error) {
      console.error(error);
    }
    delete time.user.password;
    return { message: 'عملیات موفقیت آمیز بود.', time };
  }
}
