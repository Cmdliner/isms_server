import { Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import * as cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY } from './cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(@Inject(CLOUDINARY) private readonly cloudinaryV2: typeof cloudinary.v2) { }

    async uploadFile(file: Express.Multer.File, options: UploadApiOptions = {}) {
        return new Promise((resolve, reject) => {
            const uploadOptions: UploadApiOptions = {
                folder: options.folder || 'uploads',
                resource_type: options.resource_type || 'auto',
                public_id: options.public_id,
                ...options.transformation && { transformation: options.transformation },
            };

            const uploadStream = cloudinary.v2.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            // Convert buffer to readable stream
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);

            bufferStream.pipe(uploadStream);
        });
    }

    async deleteFile(publicId: string) {
        return await cloudinary.v2.uploader.destroy(publicId);
    }

    getImageUrl(publicId: string, options: any = {}) {
        return cloudinary.v2.url(publicId, options);
    }
}
