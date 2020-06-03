import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AuthGuard as AdminAuthGuard } from 'app/core/admin-auth.guard';
import { AppComponent } from 'app/app.component';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { UiHelperModule } from 'app/ui-helper/ui-helper.module';
import { AuthGuard as UserAuthGuard } from 'app/core/user-auth.guard';

const routes: Routes = [
    {
        path: 'admin', loadChildren: () => import('./main/admin/admin.module').then((m) => m.AdminModule),
        canLoad: [AdminAuthGuard],
        canActivate: [AdminAuthGuard]
    },
    { path: 'home', loadChildren: () => import('./main/home/home.module').then((m) => m.HomeModule) },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        CoreModule,
        LayoutModule,
        UiHelperModule
    ],
    providers: [
        AdminAuthGuard,
        UserAuthGuard
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule { }
