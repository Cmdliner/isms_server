import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.enableVersioning({ prefix: 'api/v', type: VersioningType.URI });
    app.enableCors();
    app.use(compression())
    app.use(helmet());
    
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
