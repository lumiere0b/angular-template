import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ApiErrorInterceptorService, HTTP_ERRORS } from './core/api-error.interceptor.service';
import { AUTH_BROADCAST_TYPE, AuthBroadcastService } from './core/auth-broadcast.service';
import { AuthService } from './core/auth.service';
import { navigation } from 'app/navigation/navigation';
import { SnackBarService } from './ui-helper/snack-bar.service';

@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private apiError: ApiErrorInterceptorService,
        private auth: AuthService,
        private authBroadcast: AuthBroadcastService,
        private router: Router,
        private snackBar: SnackBarService
    )
    {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    this.document.body.classList.add('boxed');
                }
                else
                {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        this.apiError.error$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ error }) => {
                switch (error) {
                    case HTTP_ERRORS.BAD_REQUEST:
                        this.snackBar.show('Bad request.');
                        break;

                    case HTTP_ERRORS.UNAUTHENTICATED:
                        if (this.auth.isSignedIn) {
                            this.snackBar.show('Session expired. Sign in again.');
                            this.router.navigateByUrl('/home');
                        }
                        this.auth.resetSession();
                        break;

                    case HTTP_ERRORS.INTERNAL_SERVER_ERROR:
                        this.snackBar.show('An error occured.');
                        break;

                    case HTTP_ERRORS.MAINTENANCE_IN_PROGRESS:
                        this.snackBar.show('API Server may be in maintenance. Try later.');
                        break;

                    case HTTP_ERRORS.REQUEST_ABORTED:
                        this.snackBar.show('Request aborted.');
                        break;
                }
            });

        this.auth.getMe()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => { }, () => { });

        this.authBroadcast.broadcast$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((message) => {
                switch (message.type) {
                    case AUTH_BROADCAST_TYPE.SIGNED_IN:
                        const { isAdmin } = message.data;
                        if (isAdmin) {
                            this._fuseNavigationService.updateNavigationItem('admin-menus', { hidden: false });
                        }
                        break;

                    case AUTH_BROADCAST_TYPE.SIGNED_OUT:
                        this._fuseNavigationService.updateNavigationItem('admin-menus', { hidden: true });
                        break;
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
