import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateEntity } from './date.entity';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Timesheet } from './timesheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, DateEntity, Timesheet])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
