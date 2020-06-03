import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { fuseAnimations } from '@fuse/animations';

import AuditLog from './audit-log';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogItemDialogComponent } from './audit-log-item-dialog/audit-log-item-dialog.component';

@Component({
    selector     : 'app-audit-logs',
    templateUrl  : './audit-logs.component.html',
    styleUrls    : ['./audit-logs.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AuditLogsComponent implements OnDestroy, OnInit {
    auditLogs: AuditLog[];
    readonly COLUMNS = ['request.ip', 'user', 'context', 'createdAt'];
    count: number;
    loading = true;
    limit = 50;
    page: number;
    searchForm = new FormGroup({
        by: new FormControl('', Validators.required),
        keyword: new FormControl('')
    });
    private _unsubscribeAll: Subject<any>;

    constructor(
        private matDialog: MatDialog,
        private service: AuditLogsService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.resetSearch();
        this.init();
    }

    onPaginatorPage(event: PageEvent): void {
        this.limit = event.pageSize;
        this.page = event.pageIndex + 1;
        this.refresh();
    }

    onSubmitSearchForm(): void {
        if (this.searchForm.invalid) {
            return;
        }
        this.init();
    }

    reload(): void {
        this.resetSearch();
        this.init();
    }

    showItem(auditLog: AuditLog): void {
        this.matDialog.open(AuditLogItemDialogComponent, { data: { auditLog } });
    }

    private getList(): Observable<any> {
        this.loading = true;
        return this.service.getList(this.page, this.limit, this.searchForm.value)
            .pipe(
                finalize(() => this.loading = false),
                tap(({ count, auditLogs }) => {
                    this.count = count;
                    this.auditLogs = auditLogs.map((item) => new AuditLog(item));
                }),
                takeUntil(this._unsubscribeAll)
            );
    }

    private init(): void {
        this.page = 1;
        this.refresh();
    }

    private refresh(): void {
        this._unsubscribeAll.next();
        this.getList().subscribe(() => { }, () => { });
    }

    private resetSearch(): void {
        this.searchForm.patchValue({ by: 'username', keyword: '' });
    }
}
