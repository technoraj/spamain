import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({
    })
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
        }
      }, (err => {
        if (err instanceof HttpErrorResponse) {
          console.log('Error Msg == ', err.error);
        }
      }))
    )
  }
}
