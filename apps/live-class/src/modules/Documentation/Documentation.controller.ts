import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Description, Endpoint } from '../../utils/constants';
import { Body, Controller, Delete, Headers, Post, Put, Query } from '@nestjs/common';
import BaseController from '../../base.controller';
import { ServicePackHeader } from '../../utils/headers';
import Documentation, {
  CreateDocumentationReq,
  DocumentationUpdate
} from '@app/common-core/entities/Documentation.entity';
import { DocumentationService } from '@app/common-core/providers/Documentation.service';
import { DeleteDocumentationReq } from '../../utils/request';

@ApiTags(Endpoint.Documentation)
@ApiBearerAuth()
@Controller(Endpoint.Documentation)
export default class DocumentationController extends BaseController {

  constructor(private readonly documentationService: DocumentationService) {
    super();
  }

  @Post()
  @ApiOperation({ description: Description.DocumentExtraData })
  async create(@Headers() headers: ServicePackHeader, @Body() body: CreateDocumentationReq) {
    const documentation = body.documentation;
    documentation.creator = parseInt(headers._id);
    documentation.data = await this.documentationService.refactorIdExtraData(documentation.data);
    const doc = await this.documentationService.create(documentation);
    if (body.room_id && body.class_id) {
      await this.documentationService.createDocUsage({
        doc_id: doc.id,
        room_id: body.room_id,
        class_id: body.class_id
      });
    }
    const response = this.successRes();
    response.data = doc;
    return response;
  }

  @Put()
  @ApiOperation({ description: Description.DocumentExtraData })
  async update(@Headers() headers: ServicePackHeader, @Body() body: DocumentationUpdate) {
    const doc = body as Documentation;
    doc.data = await this.documentationService.refactorIdExtraData(doc.data);
    const update = await this.documentationService.update(doc);
    console.log("update",update)
    const response = this.successRes();
    response.data = doc;
    return response;
  }

  @Delete()
  async delete(@Headers() headers: ServicePackHeader, @Query() query: DeleteDocumentationReq) {
    if (query.is_delete_document) {
      await this.documentationService.deleteDocUsageByDocId(query.doc_id);
      await this.documentationService.deleteDocumentById(query.doc_id);
    } else {
      await this.documentationService.deleteDocUsage({
        doc_id: query.doc_id,
        room_id: query.room_id,
        class_id: query.class_id
      });
    }
  }
}