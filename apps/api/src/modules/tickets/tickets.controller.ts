import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SupportTicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportTicketsController {
  constructor(private ticketsService: SupportTicketsService) {}

  @Post()
  async createTicket(@Request() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(req.user.id, dto);
  }

  @Get('my-tickets')
  async getMyTickets(@Request() req: any) {
    return this.ticketsService.getUserTickets(req.user.id);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  async getAllTickets() {
    return this.ticketsService.getAllTickets();
  }

  @Get(':id')
  async getTicketById(@Request() req: any, @Param('id') id: string) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.ticketsService.getTicketById(id, req.user.id, isAdmin);
  }

  @Patch(':id')
  async updateTicket(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.ticketsService.updateTicket(id, req.user.id, isAdmin, dto);
  }
}
