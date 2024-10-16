import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path'; // Corrected import statement
import { ENV } from '../config/environment';

@Injectable()
export class StorageService {
  private uploadDir = ENV.uploadDir;
  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            url: `${ENV.external_host}${ENV.file_base_endpoint}/${fileName}`,
            file_name: fileName,
            original_name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
          });
        }
      });
    });
  }

  uploadMultipleFiles(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  async getFile(fileName: string) {
    const file = fs.readFileSync(path.join(this.uploadDir, fileName));
    return file;
  }
}
