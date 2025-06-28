import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { createDatabaseConfig } from '../data-source';

config();

export default registerAs<TypeOrmModuleOptions>(
  'typeorm',
  () =>
    ({
      ...createDatabaseConfig(),
      retryAttempts: 1,
    }) as TypeOrmModuleOptions
);
