import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AssistantConversationContext {
  userId: string;
  userRole: 'CUSTOMER' | 'PROVIDER';
  message: string;
  bookingId?: string;
}

export interface AssistantResponse {
  reply: string;
  suggestions?: string[];
  recommendedAction?: 'BOOK_SERVICE' | 'VIEW_FAQ' | 'CONTACT_SUPPORT' | 'NONE';
}

@Injectable()
export class AiAssistantService {
  constructor(private readonly prisma: PrismaService) {}

  async processUserMessage(context: AssistantConversationContext): Promise<AssistantResponse> {
    const text = context.message.toLowerCase();

    return {
      reply: "I am EcivreS AI Assistant. How can I help you today?",
      suggestions: ["Browse top services", "Check booking status", "Contact support"],
      recommendedAction: "NONE",
    };
  }
}
