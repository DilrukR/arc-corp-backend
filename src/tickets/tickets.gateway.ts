// src/tickets/tickets.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TicketsService } from './tickets.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WsException } from '@nestjs/websockets';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';

@WebSocketGateway({
  namespace: '/tickets',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
})
export class TicketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private connectedUsers = new Map<number, Socket>();

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new WsException('User not found');
      }

      client.data.user = user;
      this.connectedUsers.set(user.id, client);

      console.log(`Client connected: ${user.email}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      this.connectedUsers.delete(client.data.user.id);
      console.log(`Client disconnected: ${client.data.user.email}`);
    }
  }

  @SubscribeMessage('joinTicket')
  async handleJoinTicket(client: Socket, ticketId: number) {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    const ticket = await this.ticketsService.getTicketWithMessages(ticketId);
    if (!ticket) {
      throw new WsException('Ticket not found');
    }

    client.join(`ticket_${ticketId}`);
    console.log(`${client.data.user.email} joined ticket ${ticketId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { ticketId: number; content: string; isInternal: boolean },
  ) {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    const message = await this.ticketsService.addMessage(
      payload.ticketId,
      {
        content: payload.content,
        isInternalNote: payload.isInternal,
      },
      client.data.user.id,
    );

    this.server.to(`ticket_${payload.ticketId}`).emit('newMessage', {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: client.data.user.id,
        name: client.data.user.name,
      },
      isInternal: message.isInternalNote,
    });
  }

  private extractToken(client: Socket): string | null {
    return (
      client.handshake.auth.token ||
      client.handshake.headers.authorization?.split(' ')[1]
    );
  }
}
