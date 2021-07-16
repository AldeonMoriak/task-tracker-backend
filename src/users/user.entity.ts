import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';
import { Timesheet } from 'src/tasks/timesheet.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column({ select: false })
  password: string;
  @Column()
  email: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdDateTime: Timestamp;
  @OneToMany(() => Task, (task) => task.user)
  task: Task;
  @OneToMany(() => Timesheet, (timesheet) => timesheet.user, { cascade: true })
  timesheet: Timesheet;

  async validatePassword(password: string): Promise<boolean> {
    let hash: boolean;
    try {
      hash = await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error(error);
    }
    return hash;
  }
}
