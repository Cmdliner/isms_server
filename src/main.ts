import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.enableVersioning({ prefix: 'api/v', type: VersioningType.URI });
    app.enableCors();
    app.use(compression())
    app.use(helmet());
    app.use(cookieParser());

    app.useGlobalFilters(new HttpExceptionFilter);
    
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
