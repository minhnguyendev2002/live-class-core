import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../../utils/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import BaseController from '../../base.controller';
import { FileStorageService } from '@app/common-core/providers/FileStorage.service';
import { DefaultHeaders } from '../../utils/headers';
import Folder, { CreateFolderReq, DeleteFolder, UpdateFolderReq } from '@app/common-core/entities/Folder.entity';
import FileEntity, {
  DeleteFile,
  StorageContentReq,
  StorageContentResponse,
} from '@app/common-core/entities/File.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from '@app/common-core/providers/UploadFileService';
import { diskStorage } from 'multer';
import { extname } from 'path';
import moment from 'moment';
import { Util } from '@app/common-core/util/Util';

@ApiTags(Endpoint.FileStorage)
@ApiBearerAuth()
@Controller(Endpoint.FileStorage)
export default class FileStorageController extends BaseController {

  constructor(private readonly fileStorageService: FileStorageService, private readonly uploadFileService: UploadFileService) {
    super();

  }

  @Post(Endpoint.FileStorageFolder)
  async createFolder(@Headers() headers: DefaultHeaders, @Body() body: CreateFolderReq) {
    const create = body as Folder;
    create.creator = parseInt(headers._id);
    const response = this.successRes();
    response.data = await this.fileStorageService.createFolder(create);
    return response;
  }

  @Put(Endpoint.FileStorageFolder)
  async updateFolder(@Headers() headers: DefaultHeaders, @Body() body: UpdateFolderReq) {
    const response = this.successRes();
    const folder = await this.fileStorageService.findOneFolderById(body.id);
    if (body.name) {
      folder.name = body.name;
    }
    if (body.description) {
      folder.description = body.description;
    }
    response.data = this.fileStorageService.updateFolder(folder);
    return response;
  }

  @Delete(Endpoint.FileStorageFolder)
  async deleteFolder(@Headers() headers: DefaultHeaders, @Body() query: DeleteFolder) {
    await this.fileStorageService.deleteFolder(query.id);
    return this.successRes();
  }

  @Delete(Endpoint.FileStorageFile)
  async deleteFile(@Headers() headers: DefaultHeaders, @Body() query: DeleteFile) {
    await this.fileStorageService.deleteFile(query.id);
    return this.successRes();
  }

  @Post(Endpoint.FileStorageFile)
  @UseInterceptors(FilesInterceptor('files', 200, {
    storage: diskStorage({
      destination: './tmp', filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        //Calling the callback passing the random name generated with the original extension name
        const filename=Util.removeVietnamese(file.originalname).replace(/\s/g,"")
        cb(null, `${filename}${extname(file.originalname)}`);
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder_id: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFiles(@Headers() headers: DefaultHeaders, @UploadedFiles() files: Array<Express.Multer.File>, @Body('folder_id') folderId: number) {
    const response = this.successRes();
    if (files && files.length) {
      let uploaded = await this.uploadFileService.uploadMultipleAsync(files);
      let data: FileEntity[] = [];
      for (let i = 0; i < uploaded.length; i++) {
        const file = uploaded[i];
        file.creator = headers._id;
        if (folderId) {
          file.folder_id = folderId;
        }
        const create = await this.fileStorageService.createFile(file);
        data = [...data, create];
      }
      response.data = data;
    } else {
      return this.badRequestRes('files is required');
    }
    return response;
  }

  @Get(Endpoint.FileStorageContent)
  async getStorageContent(@Headers() headers: DefaultHeaders, @Query() query: StorageContentReq) {
    const files = await this.fileStorageService.findFilesByUid(headers._id, query);
    const folders = await this.fileStorageService.findFoldersByUid(headers._id, query);
    const data: StorageContentResponse = {
      files: files,
      folders: folders,
    };
    const response = this.successRes();
    response.data = data;
    response.total_record = (files.length ? files.length : 0) + (folders.length ? folders.length : 0);
    return response;
  }


}