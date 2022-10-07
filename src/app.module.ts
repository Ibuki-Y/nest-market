import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Item } from './items/entities/item.entity';

@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [Item],
        migrations: ['src/migration/*.ts'],
        // synchronize: true,
        // cli: {
        //   entitiesDir: 'src/entities',
        //   migrationsDir: 'src/migrations',
        // },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
