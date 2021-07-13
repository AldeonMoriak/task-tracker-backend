import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/interfaces/current-user.interface';
import { ResponseMessage } from 'src/interfaces/response-message.interface';
import { GetUser } from 'src/users/get-user.decorator';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

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
}
