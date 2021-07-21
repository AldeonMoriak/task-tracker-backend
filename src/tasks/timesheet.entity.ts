import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Timesheet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
  @Column({ default: true })
  isCheckIn: boolean;
  @ManyToOne(() => User, (user) => user.timesheet)
  user: User;
}
