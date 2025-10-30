import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { ApiErrorResponse } from '../../../core/common/types/api-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse() as any;
      if (typeof resp === 'string') {
        message = resp;
      } else if (resp && typeof resp === 'object') {
        message = resp.message || message;
        errors = resp.errors || resp.error || resp;
      }
    } else if (exception && typeof exception === 'object') {
      message = (exception as any).message || message;
      errors = exception;
    }

    const payload: ApiErrorResponse = {
      success: false,
      message,
      errors,
      statusCode: status,
      path: request?.url,
      timestamp,
    };

    response.status(status).json(payload);
  }
}
