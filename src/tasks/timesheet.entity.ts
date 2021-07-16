import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Timesheet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  date: Timestamp;
  @Column({ default: true })
  isCheckIn: boolean;
  @ManyToOne(() => User, (user) => user.timesheet)
  user: User;
}
