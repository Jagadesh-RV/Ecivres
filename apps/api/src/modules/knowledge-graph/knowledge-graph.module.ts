import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { GraphBuilderService } from './services/graph-builder.service';
import { KnowledgeGraphController } from './knowledge-graph.controller';

@Module({
  imports: [PrismaModule],
  controllers: [KnowledgeGraphController],
  providers: [GraphBuilderService],
  exports: [GraphBuilderService],
})
export class KnowledgeGraphModule {}
