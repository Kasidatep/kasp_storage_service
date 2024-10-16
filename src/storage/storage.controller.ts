import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ENV } from '../config/environment';
import * as mime from 'mime-types';

@Controller(ENV.file_base_endpoint)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post(ENV.upload_endpoint)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(file);
  }

  @Post(`${ENV.upload_endpoint}/multiple`)
  @UseInterceptors(FileInterceptor('files'))
  uploadMultipleFiles(@UploadedFile() files: Express.Multer.File[]) {
    return this.storageService.uploadMultipleFiles(files);
  }

  @Get(`list`)
  async listFiles() {
    return this.storageService.listFiles();
  }

  @Get(`${ENV.download_endpoint}/:filename`)
  async getFile(@Param('filename') filename: string, @Response() res: any) {
    try {
      const file = await this.storageService.getFile(filename);
      const fileExtension = filename.split('.').pop();

      const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.status(200).send(file);
    } catch (error) {
      console.error('Error:', error);
      res.status(404).send({ message: 'File not found' });
    }
  }


 
}
