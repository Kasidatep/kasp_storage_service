import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mime from 'mime-types';

@Controller('files')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') token: string,
  ): Promise<any> {
    return this.storageService.uploadFile(token, file);
  }

  @Post(`upload/multiple`)
  @UseInterceptors(FileInterceptor('files'))
  uploadMultipleFiles(
    @UploadedFile() files: Express.Multer.File[],
    @Headers('authorization') token: string,
  ) {
    return this.storageService.uploadMultipleFiles(token, files);
  }

  @Get(`list`)
  async listFiles() {
    return this.storageService.listFiles();
  }

  @Get(`download/:filename`)
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

  @Get(`view/:filename`)
  async viewFile(@Param('filename') filename: string, @Response() res: any) {
    try {
      const file = await this.storageService.getFile(filename);
      const fileExtension = filename.split('.').pop();
      const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.status(200).send(file);
    } catch (error) {
      console.error('Error:', error);
      res.status(404).send({ message: 'File not found' });
    }
  }

  @Post(`delete/:filename`)
  async deleteFile(@Param('filename') filename: string) {
    // Implement file deletion logic here
    return {
      message: `File ${filename} deleted (not really, implement logic)`,
    };
  }

  @Post('upload/custom/:fileName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileWithCustomName(
    @UploadedFile() file: Express.Multer.File,
    @Param('fileName') fileName: string,
    @Headers('authorization') token: string,
  ): Promise<any> {
    if (!fileName) {
      throw new Error('fileName query parameter is required');
    }
    return this.storageService.uploadFile(token, file, fileName);
  }
}
