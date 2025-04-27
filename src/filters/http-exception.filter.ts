import { ArgumentsHost, Catch, ExceptionFilter, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { MongooseError } from "mongoose";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status  = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.message : 'Internal server error';
        const timestamp = new Date().toISOString();

        response.status(status).json({
            error: true,
            message: message,
            timestamp
        });
    }
}