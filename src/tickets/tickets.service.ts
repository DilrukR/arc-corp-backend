import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../db/entities/ticket.entity';
import { TicketMessage } from '../db/entities/ticket-message.entity';
import { User } from '../db/entities/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { TicketStatus } from '../db/enums/ticket-status.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private messageRepository: Repository<TicketMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTicket(
    createTicketDto: CreateTicketDto,
    userId: number,
  ): Promise<Ticket> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      createdBy: user,
    });
    return this.ticketRepository.save(ticket);
  }

  // In tickets.service.ts
  async getAllTickets() {
    return await this.ticketRepository.find({
      relations: ['createdBy'],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          name: true,
          email: true,
          // Don't include sensitive fields like password
        },
      },
    });
  }

  async addMessage(
    ticketId: number,
    createMessageDto: CreateMessageDto,
    senderId: number,
  ): Promise<TicketMessage> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    const sender = await this.userRepository.findOneBy({ id: senderId });

    const message = this.messageRepository.create({
      ...createMessageDto,
      ticket,
      sender,
    });

    return this.messageRepository.save(message);
  }

  async assignTicket(ticketId: number, assigneeId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    const assignee = await this.userRepository.findOneBy({ id: assigneeId });

    ticket.assignedTo = assignee;
    ticket.status = TicketStatus.IN_PROGRESS;

    return this.ticketRepository.save(ticket);
  }

  async getTicketWithMessages(ticketId: number): Promise<Ticket> {
    return this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['messages', 'messages.sender', 'createdBy', 'assignedTo'],
    });
  }
}
