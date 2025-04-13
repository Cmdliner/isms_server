import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.enableVersioning({ prefix: 'api/v', type: VersioningType.URI });
    app.enableCors();
    app.use(helmet());
    
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
