import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = new Date();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        console.log(
          ` URL: ${request.url} - Method: ${request.method} - Status: ${
            request.statusCode
          } - Time: ${new Date().getTime() - dt.getTime()}ms`,
        );
      }),
    );
  }
}
