// src/tickets/tickets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TicketsGateway } from './tickets.gateway';
import { TicketsService } from './tickets.service';
import { Ticket } from '../db/entities/ticket.entity';
import { TicketMessage } from '../db/entities/ticket-message.entity';
import { User } from '../db/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketMessage, User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UsersModule,
  ],
  providers: [TicketsGateway, TicketsService],
})
export class TicketsModule {}
