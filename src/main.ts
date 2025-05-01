import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { extractValidationErrorMessages } from './lib/utils';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const corsOpts: CorsOptions = {
        origin: process.env.CORS_ORGIN,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        exposedHeaders: ['Authorization'],
        credentials: true
    }
    
    app.enableVersioning({ prefix: 'api/v', type: VersioningType.URI });
    app.enableCors(corsOpts);
    app.use(compression())
    app.use(helmet());
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
            const messages = errors.flatMap(error => extractValidationErrorMessages(error));

            return new UnprocessableEntityException(messages);
        }
    }))
    app.useGlobalFilters(new HttpExceptionFilter);
    
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
