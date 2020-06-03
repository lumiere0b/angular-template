import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiErrorInterceptorService } from './api-error.interceptor.service';
import { AuthBroadcastService } from './auth-broadcast.service';
import { AuthService } from './auth.service';
import { BaseApiService } from './base-api.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        ApiErrorInterceptorService,
        AuthService,
        AuthBroadcastService,
        BaseApiService,

        { provide: HTTP_INTERCEPTORS, useExisting: ApiErrorInterceptorService, multi: true }
    ]
})
export class CoreModule { }
