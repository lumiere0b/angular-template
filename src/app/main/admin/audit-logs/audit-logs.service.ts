import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import AuditLog from './audit-log';
import { BaseApiService } from 'app/core/base-api.service';

interface AuditLogListResponse {
    auditLogs: AuditLog[];
    count: number;
}

@Injectable()
export class AuditLogsService extends BaseApiService {
    getItem(id: number): Observable<AuditLog> {
        return this.get<AuditLog>({ url: `/audit-logs/${id}` });
    }

    getList(
        page?: number, limit?: number, search?: { by: string, keyword: string }
    ): Observable<AuditLogListResponse> {
        const query = { limit, page };
        if (search && search.keyword) {
            query['search-by'] = search.by;
            query['search-keyword'] = search.keyword;
        }
        return this.get<AuditLogListResponse>({ url: '/audit-logs', query });
    }
}
