import { CookieService } from 'ngx-cookie-service';
import { filter, finalize, share, tap } from 'rxjs/operators';
import Fingerprint2 from 'fingerprintjs2';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthBroadcastService, AUTH_BROADCAST_TYPE, AUTH_REQUEST_BROADCAST_TYPE } from './auth-broadcast.service';
import { BaseApiService } from './base-api.service';
import { ConfirmDialogService } from 'app/ui-helper/confirm-dialog.service';
import { environment } from 'environments/environment';
import { ProgressSpinnerService } from 'app/ui-helper/progress-spinner.service';
import Session from './session';
import { SnackBarService } from 'app/ui-helper/snack-bar.service';


@Injectable()
export class AuthService {
    private session: Session;
    private getMe$: Observable<Session>;

    constructor(
        private api: BaseApiService,
        private broadcast: AuthBroadcastService,
        private confirm: ConfirmDialogService,
        private cookie: CookieService,
        private progressSpinner: ProgressSpinnerService,
        private router: Router,
        private snackBar: SnackBarService
    ) {
        this.getMe$ = this.api.get<Session>({ url: '/auth/me' })
            .pipe(
                tap((session) => this.setSession(session)),
                share()
        );

        this.broadcast.request$
            .subscribe((message) => {
                switch (message.type) {
                    case AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT:
                        this.confirm.confirm('Do you want to sign out?')
                            .pipe(filter((answer) => answer))
                            .subscribe(() => this.signout());
                        break;
                }
            });
    }

    getMe(): Observable<Session> {
        this.progressSpinner.show('auth');
        return this.getMe$.pipe(finalize(() => this.progressSpinner.hide('auth')));
    }

    hasRole(role: string): boolean {
        return this.isSignedIn && this.session.hasRole(role);
    }

    get isAdmin(): boolean {
        return this.hasRole('admin');
    }

    get isSignedIn(): boolean {
        return !!this.session;
    }

    get isUser(): boolean {
        return this.hasRole('user');
    }

    get nickname(): string {
        return this.session ? this.session.username : '';
    }

    resetSession(): void {
        this.session = null;
        this.cookie.delete(environment.constants.JWT_COOKIE_NAME);
        this.broadcast.broadcast(AUTH_BROADCAST_TYPE.SIGNED_OUT);
    }

    signout(): void {
        this.resetSession();
        this.snackBar.show('Signed out.');
        this.router.navigateByUrl('/home');
    }

    private setSession(session: Session): void {
        this.session = new Session(session);

        Fingerprint2
            .getPromise({
                excludes: {
                    userAgent: false,
                    colorDepth: true,
                    deviceMemory: true,
                    pixelRatio: true,
                    screenResolution: true,
                    availableScreenResolution: true,
                    sessionStorage: true,
                    localStorage: true,
                    indexedDb: true,
                    openDatabase: true,
                    canvas: true,
                    hasLiedResolution: true,
                    enumerateDevices: true,
                    screen: true,
                    fonts: true,
                    audio: true,
                    webgl: true
                }
            })
            .then((components) => {
                const values = components.map((component) => component.value);
                const fingerprints = Fingerprint2.x64hash128(values.join(''), 31);

                const token = this.cookie.get(environment.constants.JWT_COOKIE_NAME);
                if (!token) {
                    return;
                }

                const helper = new JwtHelperService();

                if (helper.isTokenExpired(token)) {
                    this.snackBar.show('Token error. Sign in again.');
                    this.resetSession();
                    this.router.navigateByUrl('/home');
                    return;
                }

                const payload = helper.decodeToken(token);

                if (payload.fingerprints !== fingerprints) {
                    this.snackBar.show('Token stolen. Sign in again.');
                    this.resetSession();
                    this.router.navigateByUrl('/home');
                    return;
                }

                this.broadcast.broadcast(
                    AUTH_BROADCAST_TYPE.SIGNED_IN,
                    { isAdmin: this.isAdmin, isSignedIn: this.isSignedIn, isUser: this.isUser, nickname: this.nickname }
                );
            });
    }
}
