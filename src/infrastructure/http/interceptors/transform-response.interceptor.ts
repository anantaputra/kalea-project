import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '../../../core/common/types/api-response';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const now = new Date().toISOString();
        // Normalize responses: always ensure timestamp/meta
        if (data && typeof data === 'object' && 'success' in data) {
          const hasMeta = 'meta' in data;
          const hasTimestamp = 'timestamp' in data;
          return {
            ...data,
            meta: hasMeta ? (data as any).meta : null,
            timestamp: hasTimestamp ? (data as any).timestamp : now,
          };
        }
        const wrapped: ApiResponse<any> = {
          success: true,
          data: data ?? null,
          message: null,
          meta: null,
          timestamp: now,
        };
        return wrapped;
      }),
    );
  }
}
