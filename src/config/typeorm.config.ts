// require('dotenv/config');
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Use environmental variables to set database credentials
// const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 54321,
  username: process.env.DB_USER || 'aldeon',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'tasktracker',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  extra: { charset: 'utf8mb4_unicode_ci' },
  // TODO: synchronize must be false in production phase
  synchronize: process.env.NODE_ENV !== 'production',
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};
