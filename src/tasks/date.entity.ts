import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('date')
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'varchar',
  })
  date: Date;
  @Column({ default: true })
  isBeginning: boolean;
  @ManyToOne(() => Task, (task) => task.date, { nullable: false })
  task: Task;
}
