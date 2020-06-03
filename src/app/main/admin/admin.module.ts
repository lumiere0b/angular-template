import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'audit-logs', loadChildren: () => import('./audit-logs/audit-logs.module').then((m) => m.AuditLogsModule) }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
