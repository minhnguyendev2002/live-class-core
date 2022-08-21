import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Documentation from '@app/common-core/entities/Documentation.entity';
import { Repository } from 'typeorm';
import FileEntity, { StorageContentReq } from '@app/common-core/entities/File.entity';
import Folder, { UpdateFolderReq } from '@app/common-core/entities/Folder.entity';
import *as moment from 'moment';
import { take } from 'rxjs';

@Injectable()
export class FileStorageService {
  constructor(
    @InjectRepository(FileEntity)
    private fileEntityRepository: Repository<FileEntity>,
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {
  }

  async createFolder(folder: Folder): Promise<Folder> {
    return await this.folderRepository.save(folder);
  }

  async updateFolder(folder: Folder): Promise<Folder> {
    await this.folderRepository.update({ id: folder.id }, folder);
    return folder;
  }

  async findOneFolderById(id: number): Promise<Folder> {
    return await this.folderRepository.findOne({ id: id });
  }

  async findFilesByUid(id: string, query: StorageContentReq): Promise<FileEntity[]> {
    query.page=query.page?parseInt(query.page+""):1
    query.page_size=query.page_size?parseInt(query.page_size+""):20
    if (query.folder_id) {
      return await this.fileEntityRepository.find({where:{ creator: id, folder_id: query.folder_id },take:query.page_size,skip:(query.page-1)*query.page_size});
    } else {
      return await this.fileEntityRepository.find({where:{ creator: id, folder_id: null },take:query.page_size,skip:(query.page-1)*query.page_size});
    }
  }

  async findFoldersByUid(id: string,query: StorageContentReq): Promise<Folder[]> {
    query.page=query.page?parseInt(query.page+""):1
    query.page_size=query.page_size?parseInt(query.page_size+""):20
    if (query.folder_id) {
      return await this.folderRepository.find({where:{ creator: id, parent_id: query.folder_id },take:query.page_size,skip:(query.page-1)*query.page_size});
    } else {
      return await this.folderRepository.find({where:{ creator: id, parent_id: null },take:query.page_size,skip:(query.page-1)*query.page_size});
    }
  }

  async deleteFolder(id: number): Promise<number | undefined> {
    const folder = await this.folderRepository.findOne({ id: id });
    if (folder) {
      let subs: Folder[] = [];
      let subFolders = await this.folderRepository.find({ parent_id: id });
      subs = [...subFolders];
      while (subFolders && subFolders.length) {
        let subsTemp: Folder[] = [];
        for (let i = 0; i < subFolders.length; i++) {
          const subsTemp1 = await this.folderRepository.find({ parent_id: id });
          if (subsTemp1 && subsTemp1.length) {
            subsTemp = [...subsTemp, ...subsTemp1];
          }
        }
        subFolders = subsTemp;
        subs = [...subs, ...subsTemp];
      }
      if (subs && subs.length) {
        for (let i = 0; i < subs.length; i++) {
          await this.fileEntityRepository.delete({ folder_id: subs[i].id });
          await this.folderRepository.delete({ id: subs[i].id });
        }
      }
      const del = await this.folderRepository.delete({ id: id });
      return del.affected;
    }
    return undefined;
  }


  async createFile(file: FileEntity): Promise<FileEntity> {
    return await this.fileEntityRepository.save(file);
    ;
  }

  async deleteFile(id: number): Promise<number | undefined> {
    const del = await this.fileEntityRepository.delete({ id: id });
    return del.affected;
  }


}