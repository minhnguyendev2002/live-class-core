import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponse, create } from 'apisauce';
import FileEntity from '@app/common-core/entities/File.entity';
import { UploadResponse } from '@app/common-core/models/UploadReponse';
import IImage from 'image-size';
import * as fs from 'fs';
import *as moment from 'moment';
import * as uuid from 'uuid';

const  FormData= require('form-data');

@Injectable()
export class UploadFileService {

  api = create({
    baseURL: 'https://platforms-storage.flextech.asia/',
  });

  upload(file, mimetype: string,filename:string): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file',file,filename);
    if (mimetype.includes('image')) {
      return this.api.post<UploadResponse>('images', formData,{headers:{
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        }});
    } else if (mimetype.includes('video')) {
      return this.api.post<UploadResponse>('videos', formData,{headers:{
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        }});
    } else {
      return this.api.post<UploadResponse>('files', formData,{headers:{
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        }});
    }
  }


  async uploadMultipleAsync(files: Array<Express.Multer.File>): Promise<FileEntity[]> {
    return new Promise<FileEntity[]>(async resolve => {
      let i = 0;
      let fileEntities: FileEntity[] = [];
      files.map(async (file) => {
        console.log("file",file)
        const f=await fs.readFileSync(file.path)
        this.upload(f, file.mimetype,file.filename).then(async response => {
          console.log("response",response)
          i++;
          if ((response.status === HttpStatus.CREATED || response.status === HttpStatus.OK) && response.data.data) {
            const fileEntity: FileEntity = {
              name: uuid.v4()+"_"+file.filename,
              size: file.size,
              url: response.data.data.link,
              type: file.mimetype,
              extra_data: response.data.data,
            };
            if (file.mimetype.includes('image')) {
              const size = await IImage(f);
              fileEntity.width = size.width;
              fileEntity.height = size.height;
            }
            fileEntities = [...fileEntities, fileEntity];
          }
          checkDone();
        }).catch(e => {
          console.error(e);
          i++;
          checkDone();
        });
      });
      const checkDone = () => {
        if (i === files.length) {
          resolve(fileEntities);
        }
      };
    });
  }


}