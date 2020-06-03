import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import AuditLog from '../audit-log';

@Component({
    selector: 'app-audit-log-item-dialog',
    templateUrl: './audit-log-item-dialog.component.html',
    styleUrls: ['./audit-log-item-dialog.component.scss']
})
export class AuditLogItemDialogComponent implements OnInit {
    auditLog: AuditLog;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.auditLog = this.data.auditLog;
    }

}
