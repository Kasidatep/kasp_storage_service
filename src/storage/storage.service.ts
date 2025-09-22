import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class StorageService {
  private uploadDir: string;
  constructor(private readonly cfg: ConfigService) {
    this.uploadDir = this.cfg.get<string>('STORAGE_LOCAL_PATH', './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    token: string,
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<any> {
    await this.verifyPrvilege(token);
    const fileExtension = file.originalname.split('.').pop();
    if (fileName) {
      const fileNameExtension =
        fileName.split('.').length > 1 ? fileName.split('.').pop() : undefined;
      if (!fileNameExtension) {
        throw new BadRequestException(
          'File name should not contain extension e.g. [.jpg, .png]',
        );
      }
      if (fileNameExtension !== fileExtension) {
        throw new BadRequestException(
          `File name extension does not match the uploaded file extension, * FILE UPLOAD MUST be .${fileNameExtension}`,
        );
      }
      if (fileNameExtension && fileNameExtension === fileExtension) {
        fileName = `${fileName}`;
      } else if (!fileNameExtension) fileName = `${fileName}.${fileExtension}`;
    } else {
      fileName = `${randomUUID()}.${fileExtension}`;
    }
    const filePath = path.join(this.uploadDir, fileName);

    return new Promise((resolve, reject) => {
      // if duplicate, overwrite
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            file_name: fileName,
            original_name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
          });
        }
      });
    });
  }

  uploadMultipleFiles(token: string, files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadFile(token, file)));
  }

  async getFile(fileName: string) {
    const file = fs.readFileSync(path.join(this.uploadDir, fileName));
    return file;
  }

  async listFiles() {
    return fs.readdirSync(this.uploadDir);
  }

  // security file upload with token verify logic can be added here
  async verifyPrvilege(token: string): Promise<boolean> {
    const isDev = this.cfg.get('ENV', 'unknown') === 'dev';
    if (isDev) {
      return true;
    } else {
      const response = await fetch(
        `${this.cfg.get('VERIFY_URL', 'http://localhost:3000')}`,
        {
          headers: {
            authorization: token,
          },
        },
      );

      if (!response.ok) {
        throw new BadRequestException('sonething wrong.')
      }
      const res = await response.json();
      if (res.isAdmin) {
        return true;
      } else {
        throw new ForbiddenException(
          "you don't have permission to access this resource",
        );
      }
    }
  }
}
