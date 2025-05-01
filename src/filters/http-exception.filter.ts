import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(exception);

        const errorResponse: ErrorResponse = {
            error: true,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
        }

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const exceptionObj = exceptionResponse as Record<string, any>;
                if (Array.isArray(exceptionObj.message)) {
                    errorResponse.message = exceptionObj.message;
                } else if (exceptionObj.message|| exceptionObj.reason) {
                    errorResponse.message = exceptionObj.message;
                    errorResponse.reason = exceptionObj.reason;
                } else {
                    errorResponse.message = exception.message;
                }
            } else {
                errorResponse.message = exception.message;
            }
        } else if (exception instanceof Error) errorResponse.message = exception.message;

        response.status(statusCode).json(errorResponse);
    }
}