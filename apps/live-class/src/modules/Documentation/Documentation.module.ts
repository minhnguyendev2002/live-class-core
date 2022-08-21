import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Documentation from '@app/common-core/entities/Documentation.entity';
import DocumentationController from './Documentation.controller';
import { DocumentationService } from '@app/common-core/providers/Documentation.service';
import DocsUsage from '@app/common-core/entities/DocsUsage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documentation,DocsUsage])],
  controllers: [DocumentationController],
  providers:[DocumentationService]
})
export class DocumentationModule {
}