import { Task } from 'src/tasks/task.entity';

export interface TaskWithSubTasks {
  task: Task;
  subTasks: Task[];
}
