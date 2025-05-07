import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';


export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
    provide: CLOUDINARY,
    useFactory: (configService: ConfigService) => {
        return cloudinary.v2.config({
            cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.get<string>('CLOUDINARY_API_SECRET')
        })
    },
    inject: [ConfigService]
}
