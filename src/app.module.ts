import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from './storage/storage.module';
import { ENV } from './config/environment';

@Module({
  imports: [MongooseModule.forRoot(ENV.mongo), StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
