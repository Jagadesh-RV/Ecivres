import { Module } from '@nestjs/common';
import { CommunityDiscussionService } from './services/community-discussion.service';
import { CommunityController } from './community.controller';

@Module({
  controllers: [CommunityController],
  providers: [CommunityDiscussionService],
  exports: [CommunityDiscussionService],
})
export class CommunityModule {}
