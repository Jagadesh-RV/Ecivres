import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CommunityDiscussionService } from './services/community-discussion.service';

@ApiTags('community')
@Controller('community')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommunityController {
  constructor(private readonly communityService: CommunityDiscussionService) {}

  @Post('post')
  @ApiOperation({ summary: 'Create community discussion post' })
  async createPost(@Body() body: { authorId: string; title: string; content: string; category: string }) {
    return this.communityService.createPost(body.authorId, body.title, body.content, body.category);
  }

  @Get('showcases')
  @ApiOperation({ summary: 'Get featured provider before/after showcases' })
  async getShowcases(@Query('category') category?: string) {
    return this.communityService.getFeaturedProviderShowcases(category);
  }

  @Post('ask')
  @ApiOperation({ summary: 'Ask community Q&A question' })
  async askQuestion(@Body() body: { authorId: string; question: string; category: string }) {
    return this.communityService.submitQuestion(body.authorId, body.question, body.category);
  }
}
