import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeormPostgresConfig from './database/config/typeorm.env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RuralProducerModule } from './modules/rural-producers/rural-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeormPostgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>(
          'typeorm'
        ) as TypeOrmModuleOptions,
    }),
    RuralProducerModule,
  ],
})
export class AppModule {}
