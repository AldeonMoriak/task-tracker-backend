import { Injectable, NotFoundException } from '@nestjs/common';
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
  // createTask(name, parentId)
  // renameTask(id, name)
  // deleteTask(id)
  // addDescriptionToTask(id, content)
  // checkIn()
  // checkOut()
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
}
