import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuditLogItemDialogComponent } from './audit-log-item-dialog/audit-log-item-dialog.component';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsService } from './audit-logs.service';

const routes: Routes = [
    { path: '', component: AuditLogsComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,

        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSelectModule,
        MatTableModule,

        FuseSharedModule
    ],
    declarations: [
        AuditLogsComponent,
        AuditLogItemDialogComponent
    ],
    entryComponents: [
        AuditLogItemDialogComponent
    ],
    providers: [
        AuditLogsService
    ]
})
export class AuditLogsModule { }
