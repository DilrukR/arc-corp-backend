import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto, null);
  }

  @Post(':id/messages')
  addMessage(
    @Param('id') ticketId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.ticketsService.addMessage(
      +ticketId,
      createMessageDto,
      null, // No sender ID
    );
  }

  @Patch(':id/assign')
  assignTicket(
    @Param('id') ticketId: string,
    @Body() assignDto: { assigneeId: number },
  ) {
    return this.ticketsService.assignTicket(+ticketId, assignDto.assigneeId);
  }

  @Get(':id')
  getTicket(@Param('id') ticketId: string) {
    return this.ticketsService.getTicketWithMessages(+ticketId);
  }
}
