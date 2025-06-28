import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config();

export const createDatabaseConfig = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.PG_HOSTNAME,
    port: Number(process.env.PG_PORT || 5432),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [path.resolve(__dirname, 'models', '*.model.{ts,js}')],
    migrations: [path.resolve(__dirname, 'migrations/*.{ts,js}')],
    synchronize: false,
    logging: process.env.PG_LOGGING === 'true' ? ['warn', 'error'] : ['error'],
  };
};

const dataSource = new DataSource(createDatabaseConfig());

export default dataSource;
