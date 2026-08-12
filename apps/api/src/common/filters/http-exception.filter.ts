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
      const res = exception.getResponse() as string | Record<string, unknown>;

      message =
        typeof res === 'string'
          ? res
          : (res?.message as string) || (res?.error as string) || exception.message;

      // Basic mapping for code
      if (status === HttpStatus.BAD_REQUEST) code = 'BAD_REQUEST';
      else if (status === HttpStatus.UNAUTHORIZED) code = 'UNAUTHORIZED';
      else if (status === HttpStatus.FORBIDDEN) code = 'FORBIDDEN';
      else if (status === HttpStatus.NOT_FOUND) code = 'NOT_FOUND';
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
