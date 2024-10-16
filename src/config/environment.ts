import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/nest',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  external_host: process.env.EXTERNAL_HOST || 'http://localhost:3000',
  upload_endpoint: process.env.ENDPOINT_UPLOAD || '',
  download_endpoint: process.env.ENDPOINT_DOWNLOAD || '',
  file_base_endpoint: process.env.ENDPOINT_BASE || '',
};
