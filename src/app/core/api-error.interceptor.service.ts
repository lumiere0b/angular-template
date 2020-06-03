import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

export enum HTTP_ERRORS {
    REQUEST_ABORTED,
    BAD_REQUEST,
    UNAUTHENTICATED,
    INTERNAL_SERVER_ERROR,
    MAINTENANCE_IN_PROGRESS
}

@Injectable()
export class ApiErrorInterceptorService {
    error$: Subject<{ error: HTTP_ERRORS }>;

    constructor() {
        this.error$ = new Subject();
    }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.error instanceof ErrorEvent) {
                        this.error$.next({ error: HTTP_ERRORS.REQUEST_ABORTED });
                        return throwError(error);
                    }
                    if (error.status <= 0) {
                        this.error$.next({ error: HTTP_ERRORS.REQUEST_ABORTED });
                        return throwError(error);
                    }

                    switch (error.status) {
                        case 400:
                            this.error$.next({ error: HTTP_ERRORS.BAD_REQUEST });
                            break;

                        case 401:
                        case 403:
                            this.error$.next({ error: HTTP_ERRORS.UNAUTHENTICATED });
                            break;

                        case 500:
                            this.error$.next({ error: HTTP_ERRORS.INTERNAL_SERVER_ERROR });
                            break;

                        case 502:
                        case 503:
                        case 504:
                            this.error$.next({ error: HTTP_ERRORS.MAINTENANCE_IN_PROGRESS });
                            break;

                    }
                    return throwError(error);
                })
            );
    }
}
