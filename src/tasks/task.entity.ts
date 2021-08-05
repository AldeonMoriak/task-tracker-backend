import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @ManyToOne(() => Task, (task) => task.id, { nullable: true, cascade: true })
  parent: Task;
  @ManyToOne(() => User, (user) => user.task)
  user: User;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'varchar',
  })
  createdDateTime: Date;
  @OneToMany(() => DateEntity, (date) => date.task, {
    cascade: true,
    eager: true,
  })
  date: DateEntity[];
  @Column('text', { nullable: true })
  description: string;
  @Column({
    type: 'varchar',
  })
  usedDate: Date;
}
