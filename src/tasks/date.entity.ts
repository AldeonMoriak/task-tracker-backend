import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
@Unique(['username', 'email'])
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with local time zone',
  })
  date: Timestamp;
  @Column({ default: true })
  isBeginning: boolean;
  @ManyToOne(() => Task, (task) => task.date)
  task: Task;
}
