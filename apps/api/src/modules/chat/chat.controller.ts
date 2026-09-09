import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService, SendMessageDto } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Send message to customer/provider' })
  async sendMessage(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(user.id, dto);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get conversation history with another user' })
  async getConversationHistory(
    @CurrentUser() user: any,
    @Query('otherUserId') otherUserId: string,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversationHistory(user.id, otherUserId, limit);
  }
}
