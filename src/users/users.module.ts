import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../db/entities/user.entity';
import { Task } from '../db/entities/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if needed by other modules
})
export class UsersModule {}
