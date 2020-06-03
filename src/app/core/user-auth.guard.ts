import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, flatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean | UrlTree> {
        if (this.auth.isUser || this.auth.isAdmin) {
            return true;
        }

        return this.auth.getMe()
            .pipe(
                flatMap(() => (this.auth.isUser || this.auth.isAdmin) ? of(true) : throwError(null)),
                catchError(() => {
                    this.router.navigateByUrl('/home');
                    return of(false);
                })
            );
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
        if (this.auth.isUser || this.auth.isAdmin) {
            return true;
        }

        return this.auth.getMe()
            .pipe(
                flatMap(() => (this.auth.isUser || this.auth.isAdmin) ? of(true) : throwError(null)),
                catchError(() => {
                    this.router.navigateByUrl('/home');
                    return of(false);
                })
            );
    }
}
