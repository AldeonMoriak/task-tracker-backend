import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(typeOrmConfig), TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
