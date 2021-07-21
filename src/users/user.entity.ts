import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';
import { Timesheet } from 'src/tasks/timesheet.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column()
  username: string;
  @Column({ select: false })
  password: string;
  @Column({ nullable: true })
  email: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'varchar' })
  createdDateTime: Date;
  @OneToMany(() => Task, (task) => task.user)
  task: Task;
  @OneToMany(() => Timesheet, (timesheet) => timesheet.user, { cascade: true })
  timesheet: Timesheet;

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    let hash: boolean;
    try {
      hash = await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error(error);
    }
    return hash;
  }
}
