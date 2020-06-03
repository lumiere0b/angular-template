import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AuthBroadcastService, AUTH_BROADCAST_TYPE, AUTH_REQUEST_BROADCAST_TYPE } from 'app/core/auth-broadcast.service';
import { navigation } from 'app/navigation/navigation';

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    hiddenNavbar: boolean;
    isSignedIn = false;
    navigation: any;
    nickname: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private authBroadcast: AuthBroadcastService
    )
    {
        this.navigation = navigation;

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
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        this.authBroadcast.broadcast$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((message) => {
                switch (message.type) {
                    case AUTH_BROADCAST_TYPE.SIGNED_IN:
                        const { isSignedIn, nickname } = message.data;
                        this.isSignedIn = isSignedIn;
                        this.nickname = nickname;
                        break;

                    case AUTH_BROADCAST_TYPE.SIGNED_OUT:
                        this.isSignedIn = false;
                        this.nickname = null;
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

    signin(): void {
        // TODO: Signin
    }

    signout(): void {
        this.authBroadcast.request(AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT);
    }
}
