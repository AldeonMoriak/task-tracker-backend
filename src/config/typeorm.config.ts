// require('dotenv/config');
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Use environmental variables to set database credentials
// const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 54321,
  username: 'aldeon',
  password: 'password',
  database: 'tasktracker',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  extra: { charset: 'utf8mb4_unicode_ci' },
  // TODO: synchronize must be false in production phase
  synchronize: process.env.NODE_ENV !== 'production',
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};
