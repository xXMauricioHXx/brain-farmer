import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logger } from './winston.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    const now = Date.now();
    logger.info(
      `Incoming Request: ${method} ${url} - body: ${JSON.stringify(body)}`
    );

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        logger.info(`Response: ${method} ${url} - ${responseTime}ms`);
      })
    );
  }
}
