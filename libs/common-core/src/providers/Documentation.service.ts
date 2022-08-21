import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Documentation, { DocumentationExtraData } from '@app/common-core/entities/Documentation.entity';
import * as uuid from 'uuid';
import DocsUsage from '@app/common-core/entities/DocsUsage.entity';

@Injectable()
export class DocumentationService {
  constructor(
    @InjectRepository(Documentation)
    private documentationRepository: Repository<Documentation>,
    @InjectRepository(DocsUsage)
    private docsUsageRepository: Repository<DocsUsage>
  ) {
  }

  async create(create: Documentation): Promise<Documentation> {
    delete create.id;
    delete create.updated_at;
    delete create.created_at;
    return await this.documentationRepository.save(create);
  }

  async update(doc: Documentation): Promise<number|undefined> {
    const update = await this.documentationRepository.update({ id: doc.id }, doc);
    return update.affected;
  }


  async refactorIdExtraData(data: DocumentationExtraData[]): Promise<DocumentationExtraData[]> {
    return new Promise<DocumentationExtraData[]>((resolve, reject) => {
      try {
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {

            if (!data[i].id) {
              data[i].id = uuid.v4();
            }
            const doubleCheckInside = (item: DocumentationExtraData[]): DocumentationExtraData[] => {
              if (item && item.length) {
                for (let j = 0; j < item.length; j++) {
                  if (!item[j].id) {
                    item[j].id = uuid.v4();
                  }
                  if (item[j].data) {
                    item[j].data = doubleCheckInside(item[j].data);
                  }
                }
              }
              return item;
            };
            if (data[i].data && data[i].data.length) {
              data[i].data = doubleCheckInside(data[i].data);
            }
          }
        }
        resolve(data);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  async createDocUsage(docsUsage: DocsUsage): Promise<DocsUsage> {
    return await this.docsUsageRepository.save(docsUsage);
  }

  async getDocByRoomId(roomId: number): Promise<Documentation[]> {
    const docsUsages = await this.docsUsageRepository.find({ room_id: roomId });
    const docs: Documentation[] = [];
    if (docsUsages && docsUsages.length) {
      for (let i = 0; i < docsUsages.length; i++) {
        const doc = await this.documentationRepository.findOne({ id: docsUsages[i].doc_id });
        docs.push(doc);
      }
    }
    return docs;
  }

  async deleteDocUsage(docsUsage: DocsUsage) {
    return await this.docsUsageRepository.delete({
      doc_id: docsUsage.doc_id,
      class_id: docsUsage.class_id,
      room_id: docsUsage.room_id
    });
  }

  async deleteDocUsageByDocId(docId: number) {
    return await this.docsUsageRepository.delete({ doc_id: docId });
  }

  async deleteDocumentById(id: number) {
    return await this.documentationRepository.delete({ id: id });
  }
}