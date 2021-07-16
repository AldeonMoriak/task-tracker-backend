import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  date: Timestamp;
  @Column({ default: true })
  isBeginning: boolean;
  @ManyToOne(() => Task, (task) => task.date)
  task: Task;
}
