import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UploadService {
  constructor(private userService: UserService) {}

  private blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING || 'none',
  );

  private containerClient =
    this.blobServiceClient.getContainerClient('myimages');

  async uploadFileToAzureThenSaveLocally(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const blobName = `${uuidv4()}-${file.originalname}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    await this.userService.updateProfile(userId, {
      image: blockBlobClient.url,
    });

    return blockBlobClient.url;
  }
}
