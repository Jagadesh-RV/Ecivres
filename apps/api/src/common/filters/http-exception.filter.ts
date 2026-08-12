import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      message =
        typeof res === 'string'
          ? res
          : res.message || res.error || exception.message;

      // Basic mapping for code
      if (status === 400) code = 'BAD_REQUEST';
      else if (status === 401) code = 'UNAUTHORIZED';
      else if (status === 403) code = 'FORBIDDEN';
      else if (status === 404) code = 'NOT_FOUND';
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }
}
