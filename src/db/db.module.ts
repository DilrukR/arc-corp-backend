import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      ssl: false, // Azure VM's public IP
      port: 5432,
      username: 'postgres', // Default user (change if modified)
      password: 'rishan1234@4321', // Password you set earlier
      database: 'arc_corp', // Your database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (disable in production)
      logging: true,
    }),
  ],
})
export class DbModule {}
