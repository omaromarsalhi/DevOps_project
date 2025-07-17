import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, UserService],
  exports: [UploadService],
})
export class UploadModule {}
