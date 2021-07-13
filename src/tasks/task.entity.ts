import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { DateEntity } from './date.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ default: false })
  isTicking: boolean;
  @ManyToOne(() => Task, (task) => task.id, { nullable: true })
  parent: Task;
  @ManyToOne(() => User, (user) => user.task)
  user: User;
  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdDateTime: Timestamp;
  @OneToMany(() => DateEntity, (date) => date.task)
  date: DateEntity;
  @Column('text')
  description: string;
}
