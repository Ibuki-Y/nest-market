import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ItemsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
