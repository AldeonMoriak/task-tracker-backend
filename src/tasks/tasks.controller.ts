import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/interfaces/current-user.interface';
import { ResponseMessage } from 'src/interfaces/response-message.interface';
import { TimeEditLimitation } from 'src/interfaces/time-edit-limitation.interface';
import { GetUser } from 'src/users/get-user.decorator';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { DateEntity } from './date.entity';
import { AddDescriptionDTO } from './dto/add-description.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { EditTimeOfTaskDTO } from './dto/edit-time-of-task.dto';
import { RenameTaskDTO } from './dto/rename-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Timesheet } from './timesheet.entity';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Post('/createTask')
  async createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage> {
    return this.tasksService.createTask(
      currentUser,
      createTaskDTO.title,
      createTaskDTO.parentId,
    );
  }

  @Post('/addTimeToTask')
  async addTimeToTask(
    @Body('id') id: number,
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage> {
    return this.tasksService.addTimeToTask(
      currentUser,
      id,
    );
  }

  @Patch('/renameTask')
  async renameTask(
    @Body() renameTaskDTO: RenameTaskDTO,
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage> {
    return this.tasksService.renameTask(
      currentUser,
      renameTaskDTO.id,
      renameTaskDTO.title,
    );
  }

  @Delete('/deleteTask')
  async deleteTask(
    @Body() id: number,
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage> {
    return this.tasksService.deleteTask(currentUser, id);
  }

  @Patch('/addDescriptionToTask')
  async addDescriptionToTask(
    @Body() addDescriptionDTO: AddDescriptionDTO,
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage> {
    return this.tasksService.addDescriptionToTask(
      currentUser,
      addDescriptionDTO.id,
      addDescriptionDTO.content,
    );
  }

  @Get('/Check')
  async check(
    @GetUser() currentUser: CurrentUser,
  ): Promise<ResponseMessage & { time: Timesheet }> {
    return this.tasksService.check(currentUser);
  }

  @Post('/getTimeEditLimitation')
  async getTimeEditLimitation(
    @GetUser() currentUser: CurrentUser,
    @Body() id: number,
  ): Promise<TimeEditLimitation> {
    return this.tasksService.getTimeEditLimitation(currentUser, id);
  }
  @Post('/editTimeOfTask')
  async editTimeOfTask(
    @GetUser() currentUser: CurrentUser,
    @Body() editTimeOfTaskDTO: EditTimeOfTaskDTO,
  ): Promise<ResponseMessage> {
    return this.tasksService.editTimeOfTask(
      currentUser,
      editTimeOfTaskDTO.id,
      editTimeOfTaskDTO.time,
    );
  }

  @Get('/getTodayTasks')
  async getTodayTasks(@GetUser() currentUser: CurrentUser): Promise<Task[]> {
    return this.tasksService.getTodayTasks(currentUser);
  }

  @Post('/getTasksOfADay')
  async getTsaksOfADay(
    @GetUser() currentUser: CurrentUser,
    @Body() date: Date,
  ): Promise<Task[]> {
    return this.tasksService.getTasksOfADay(currentUser, date);
  }

  @Post('/getDatesOfADay')
  async getDatesOfADay(
    @GetUser() currentUser: CurrentUser,
    @Body() date: Date,
  ): Promise<DateEntity[]> {
    return this.tasksService.getDatesOfADay(currentUser, date);
  }
}
