import {
  ImATeapotException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from '../interfaces/user-info.interface';
import { CurrentUser } from 'src/interfaces/current-user.interface';
import { ResponseMessage } from 'src/interfaces/response-message.interface';
import { TaskWithSubTasks } from 'src/interfaces/task.interface';
import { TimeEditLimitation } from 'src/interfaces/time-edit-limitation.interface';
import { UsersService } from 'src/users/users.service';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
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

  async createTask(
    currentUser: CurrentUser,
    title: string,
    parentId: number,
    id: number,
  ): Promise<ResponseMessage> {
    let task: Task;
    const user = await this.userService.findOne(currentUser.username);
    if (id) {
      task = await this.tasksRepositiory.findOne(
        { id },
        { relations: ['user', 'parent'] },
      );
      if (task.user.username !== user.username)
        throw new UnauthorizedException('شما به این عملیات دسترسی ندارید.');
    } else {
      task = new Task();
    }
    task.title = title;
    if (parentId) {
      const parent = await this.tasksRepositiory.findOne({ id: parentId });
      if (!parent) {
        throw new NotFoundException('تسک مورد نظر یافت نشد.');
      }
      task.parent = parent;
      task.parent.usedDate = new Date();
    }
    task.user = user;
    task.usedDate = new Date();

    try {
      task.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async getTasksNames(currentUser: CurrentUser): Promise<Task[]> {
    const user = await this.userService.findOne(currentUser.username);
    return this.tasksRepositiory
      .createQueryBuilder('task')
      .select(['task.id', 'task.title'])
      .innerJoin('task.user', 'user')
      .where('user.username = :username', { username: user.username })
      .andWhere('task.parentId is null')
      .getMany();
  }

  async getSubtasksNames(currentUser: CurrentUser): Promise<Task[]> {
    const user = await this.userService.findOne(currentUser.username);
    return this.tasksRepositiory
      .createQueryBuilder('task')
      .select(['task.id', 'task.title', 'parent.id'])
      .innerJoin('task.user', 'user')
      .innerJoin('task.parent', 'parent')
      .where('user.username = :username', { username: user.username })
      .andWhere('task.parentId is not null')
      .getMany();
  }

  async renameTask(
    currentUser: CurrentUser,
    id: number,
    title: string,
  ): Promise<ResponseMessage> {
    const task = await this.tasksRepositiory.findOne(
      { id },
      { relations: ['user'] },
    );
    if (!task) {
      throw new NotFoundException('تسک مورد نظر یافت نشد');
    }
    const user = await this.userService.findOne(currentUser.username);
    if (!user || task.user.username !== user.username) {
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
  ): Promise<ResponseMessage & { isCheckIn: boolean }> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    }

    const lastCheck = await this.timesheetRepository
      .createQueryBuilder('time')
      .select()
      .innerJoin('time.user', 'user')
      .where('time.userId = :userId', { userId: user.id })
      .andWhere('time.date > :start', {
        start: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      })
      .orderBy('time.date', 'DESC')
      .getOne();

    const task = await this.tasksRepositiory
      .createQueryBuilder('task')
      .select()
      .innerJoin('task.date', 'date')
      .innerJoin('task.user', 'user')
      .where('user.id = :id', { id: user.id })
      .andWhere('task.isTicking = :isTicking', { isTicking: true })
      .orderBy('date.date', 'DESC')
      .getOne();

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
    time.date = new Date();
    try {
      time.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.', isCheckIn: time.isCheckIn };
  }

  async addTimeToTask(
    currentUser: CurrentUser,
    id: number,
  ): Promise<ResponseMessage & { date: DateEntity }> {
    const task = await this.tasksRepositiory.findOne(
      { id },
      { relations: ['user'] },
    );
    if (!task) {
      throw new NotFoundException('تسک مورد نظر یافت نشد.');
    }
    const user = await this.userService.findOne(currentUser.username);
    if (!user || task.user.username !== user.username) {
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید.');
    }
    const lastCheck = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .select()
      .innerJoin('timesheet.user', 'user')
      .where('timesheet.userId = :id', { id: user.id })
      .orderBy('timesheet.date', 'DESC')
      .getOne();
    const today = new Date();
    if (
      !lastCheck ||
      new Date(lastCheck.date).setHours(0, 0, 0, 0) !==
        today.setHours(0, 0, 0, 0)
    ) {
      throw new NotAcceptableException('برای امروز ورودی ثبت نشده است.');
    } else if (
      new Date(lastCheck.date).setHours(0, 0, 0, 0) ===
        today.setHours(0, 0, 0, 0) &&
      !lastCheck.isCheckIn
    ) {
      throw new NotAcceptableException('ورود ثبت نشده است.');
    }
    const lastDate = await this.dateRepository
      .createQueryBuilder('date')
      .select()
      .innerJoin('date.task', 'task')
      .where('date.taskId = :id', { id: task.id })
      .andWhere('date.date > :lastCheckDate', {
        lastCheckDate: lastCheck.date,
      })
      .orderBy('date.date', 'DESC')
      .getOne();
    const date = new DateEntity();
    date.task = task;
    date.date = new Date();
    if (lastDate?.isBeginning) {
      date.isBeginning = false;
      task.isTicking = false;
    }
    if (!lastDate || !lastDate.isBeginning) {
      task.isTicking = true;
      const todayTasks = await this.getTodayTasks(currentUser);
      const tickingTask = todayTasks.find(
        (aTask) => aTask.task.id !== task.id && aTask.task.isTicking,
      );
      if (tickingTask) {
        tickingTask.task.isTicking = false;
        const newDate = new DateEntity();
        newDate.task = tickingTask.task;
        newDate.isBeginning = false;
        tickingTask.task.isTicking = false;
        try {
          await tickingTask.task.save();
        } catch (error) {
          throw new ImATeapotException(error);
        }
        try {
          newDate.save();
        } catch (error) {
          throw new ImATeapotException(error);
        }
      }
    }
    try {
      await task.save();
    } catch (error) {
      throw new ImATeapotException(error);
    }
    try {
      await date.save();
    } catch (error) {
      throw new ImATeapotException(error);
    }

    return { message: 'عملیات موفقیت آمیز بود.', date };
  }
  async getTimeEditLimitation(
    currentUser: CurrentUser,
    id: number,
  ): Promise<TimeEditLimitation> {
    const date = await this.dateRepository.findOne({
      id,
    });
    if (!date) {
      throw new NotFoundException('زمان مورد نظر یافت نشد');
    }

    const startOfTheDay = new Date(date.date.valueOf()).setHours(0, 0, 0, 0);

    const user = await this.userService.findOne(currentUser.username);
    if (!user || user.username !== date.task.user.username)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید.');
    let downLimit: Date;
    let upLimit: Date;

    const previousDate = await this.dateRepository.findOne({
      where: {
        task: date.task,
        date: LessThan(date.date),
      },
    });

    downLimit = new Date(previousDate.date.valueOf());

    const nextDate = await this.dateRepository.findOne({
      where: {
        task: date.task,
        date: MoreThan(date.date),
      },
    });

    upLimit = new Date(nextDate.date.valueOf());

    if (previousDate.date.setHours(0, 0, 0, 0) !== startOfTheDay) {
      const checkIn = await this.timesheetRepository.findOne({
        where: {
          user: date.task.user,
          date: LessThan(date.date),
        },
      });
      downLimit = checkIn ? checkIn.date : new Date(startOfTheDay.valueOf());
    }

    if (nextDate.date.setHours(0, 0, 0, 0) !== date.date.setHours(0, 0, 0, 0)) {
      const checkOut = await this.timesheetRepository.findOne({
        where: {
          user: date.task.user,
          date: MoreThan(date.date),
        },
      });
      upLimit = checkOut
        ? checkOut.date
        : new Date(
            new Date(startOfTheDay.valueOf()).setHours(23, 59, 59).valueOf(),
          );
    }

    return { upLimit, downLimit };
  }

  async editTimeOfTask(
    currentUser: CurrentUser,
    id: number,
    time: Date,
  ): Promise<ResponseMessage> {
    const limitations = await this.getTimeEditLimitation(currentUser, id);

    const date = await this.dateRepository.findOne({
      id,
    });

    if (limitations.downLimit > time || limitations.upLimit < time) {
      throw new NotAcceptableException('زمان انتخابی از محدوده مجاز خارج است.');
    }

    date.date = time;
    try {
      date.save();
    } catch (error) {
      console.error(error);
    }

    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async getTodayTasks(currentUser: CurrentUser): Promise<TaskWithSubTasks[]> {
    return this.getTasksOfADay(currentUser, new Date());
  }

  async getTasksOfADay(
    currentUser: CurrentUser,
    theDate: Date,
  ): Promise<TaskWithSubTasks[]> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user)
      throw new UnauthorizedException('شما به این قسمت دسترسی ندارید.');
    const todayTasks: TaskWithSubTasks[] = [];
    const tasks = await this.tasksRepositiory
      .createQueryBuilder('task')
      .select()
      .innerJoin('task.user', 'user')
      .leftJoinAndSelect('task.date', 'date')
      .leftJoinAndSelect('task.parent', 'parent')
      .where('user.username = :username', { username: user.username })
      .andWhere('task.parentId is null')
      .andWhere('task.usedDate > :now', {
        now: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      })
      .getMany();

    tasks.map((task) => {
      task.date = task.date.sort((a, b) => a.id - b.id);
      const dates: DateEntity[] = [];
      task.date.map((date) => {
        if (new Date(date.date) > new Date(new Date().setHours(0, 0, 0, 0)))
          dates.push(date);
      });
      task.date = dates;
      if (!dates && task.isTicking) {
        task.isTicking = false;
      }
    });

    await Promise.all(
      tasks.map(async (el) => {
        const subTasks = await this.tasksRepositiory.find({
          join: {
            alias: 'task',
            innerJoin: {
              user: 'task.user',
              parent: 'task.parent',
            },
            leftJoinAndSelect: {
              date: 'task.date',
            },
          },
          where: {
            user: user,
            parent: el.id,
            usedDate: Between(
              new Date(theDate.setHours(0, 0, 0, 0)),
              new Date(theDate.setHours(23, 59, 59, 999)),
            ),
          },
        });
        todayTasks.push({
          task: el,
          subTasks,
        });
      }),
    );
    return todayTasks;
  }

  async getDatesOfADay(
    currentUser: CurrentUser,
    date: Date,
  ): Promise<DateEntity[]> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید.');

    const dates = await this.dateRepository.find({
      where: {
        task: {
          user: user,
        },
        date: Between(
          new Date(date.setHours(0, 0, 0, 0)),
          new Date(date.setHours(23, 59, 59, 999)),
        ),
      },
    });
    return dates;
  }
  async deleteDate(
    currentUser: CurrentUser,
    dateId: number,
  ): Promise<ResponseMessage> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');

    const date = await this.dateRepository.findOne(
      { id: dateId },
      { relations: ['task', 'user'] },
    );
    if (!date) throw new NotFoundException('زمان مورد نظر یافت نشد.');

    if (date.task.user.username !== user.username)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    await this.dateRepository.delete({ id: date.id });

    return { message: 'عملیات موفقیت‌آمیز بود.' };
  }

  async removeTaskFromToday(
    currentUser: CurrentUser,
    taskId: number,
  ): Promise<ResponseMessage> {
    const user = await this.userService.findOne(currentUser.username);
    if (!user)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    const task = await this.tasksRepositiory.findOne(
      { id: taskId },
      { relations: ['date', 'user'] },
    );
    if (!task) throw new NotFoundException('تسک مورد نظر یافت نشد.');
    if (user.username !== task.user.username)
      throw new UnauthorizedException('شما به این عملیات دسترسی ندارید');
    if (new Date(task.usedDate).valueOf() < new Date().setHours(0, 0, 0, 0))
      throw new NotAcceptableException(
        'تسک مورد نظر در این روز استفاده نشده است.',
      );
    await this.dateRepository.delete({
      task: { id: task.id },
      date: Between(
        new Date().setHours(0, 0, 0, 0),
        new Date().setHours(23, 59, 59, 99),
      ),
    });
    const today = new Date();
    const dayBefore = today.setDate(today.getDate() - 1);
    task.usedDate = new Date(dayBefore);
    try {
      task.save();
    } catch (error) {
      console.error(error);
    }
    return { message: 'عملیات موفقیت آمیز بود.' };
  }

  async getUserInfo(
    currentUser: CurrentUser,
  ): Promise<UserInfo & { time: Timesheet }> {
    const user = await this.userService.getProfile(currentUser);
    let time = user.timesheet.sort((a, b) => b.id - a.id)[0];
    if (new Date(time.date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      time = null;
    }

    let isCheckedIn = false;
    if (time) isCheckedIn = time.isCheckIn;
    return { isCheckedIn, name: user.name ?? user.username, time };
  }
}
