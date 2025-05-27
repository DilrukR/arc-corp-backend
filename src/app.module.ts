import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { DepartmentsModule } from './departments/departments.module';
import { CommonModule } from './common/common.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [DbModule, AuthModule, UsersModule, TasksModule, AssignmentsModule, SubtasksModule, DepartmentsModule, CommonModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
