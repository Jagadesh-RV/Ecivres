import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommunityDiscussionService {
  private readonly logger = new Logger(CommunityDiscussionService.name);

  createPost(authorId: string, title: string, content: string, category: string) {
    const postId = `pst_${Date.now()}`;
    this.logger.log(`Created community post ${postId} by author ${authorId} in ${category}`);
    return {
      postId,
      authorId,
      title,
      content,
      category,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
  }
}
