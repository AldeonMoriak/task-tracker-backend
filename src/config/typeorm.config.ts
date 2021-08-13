require('dotenv/config');
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Use environmental variables to set database credentials
const { DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  extra: { charset: 'utf8mb4_unicode_ci' },
  // TODO: synchronize must be false in production phase
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: {
    rejectUnauthorized: false,
  },
  useUTC: false,
};
