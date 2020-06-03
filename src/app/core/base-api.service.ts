import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { stringify } from 'qs';

import { environment } from 'environments/environment';

const API_PREFIX = environment.constants.API_PREFIX;

@Injectable()
export class BaseApiService {
    constructor(public http: HttpClient) { }

    delete<T>(
        { url = '', query = {} }: { url: string, query?: any }, options: any = {}
    ): Observable<T> {
        const q = this.getQueryString(query);
        return this.http
            .delete<T>(
                `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
                Object.assign({}, this.REQUEST_OPTIONS, options)
            )
            .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
    }

    get<T>(
        { url = '', query = {} }: { url: string, query?: any }, options: any = {}
    ): Observable<T> {
        const q = this.getQueryString(query);
        return this.http
            .get<T>(
                `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
                Object.assign({}, this.REQUEST_OPTIONS, options)
            )
            .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
    }

    post<T>(
        { url = '', query = {} }: { url: string, query?: any }, body = {}, options: any = {}
    ): Observable<T> {
        const q = this.getQueryString(query);
        return this.http
            .post<T>(
                `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
                body,
                Object.assign({}, this.REQUEST_OPTIONS, options)
            )
            .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
    }

    put<T>(
        { url = '', query = {} }: { url: string, query?: any }, body = {}, options: any = {}
    ): Observable<T> {
        const q = this.getQueryString(query);
        return this.http
            .put<T>(
                `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
                body,
                Object.assign({}, this.REQUEST_OPTIONS, options)
            )
            .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
    }

    private getQueryString(query: any): string {
        return stringify(query, { arrayFormat: 'bracket' });
    }

    private handleResponse<T>(response): T {
        return response.body;
    }

    private get REQUEST_OPTIONS(): { headers: HttpHeaders, observe: string } {
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            observe: 'response'
        };
    }
}
