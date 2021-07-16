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
import { GetUser } from 'src/users/get-user.decorator';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { AddDescriptionDTO } from './dto/add-description.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { RenameTaskDTO } from './dto/rename-task.dto';
import { TasksService } from './tasks.service';
import { Timesheet } from './timesheet.entity';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

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

  @Delete('/')
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
}
