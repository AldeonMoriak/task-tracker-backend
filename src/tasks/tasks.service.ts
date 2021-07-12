import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
