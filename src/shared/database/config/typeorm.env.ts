import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export default registerAs<TypeOrmModuleOptions>('typeorm', () => {
  return {
    type: 'postgres',
    host: process.env.PG_HOSTNAME,
    port: Number(process.env.PG_PORT || 5432),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: false,
    logging: process.env.PG_LOGGING === 'true' ? ['warn', 'error'] : ['error'],
    autoLoadEntities: true,
    retryAttempts: 1,
  } as TypeOrmModuleOptions;
});
