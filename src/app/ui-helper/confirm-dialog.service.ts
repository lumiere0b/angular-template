import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Injectable()
export class ConfirmDialogService {
    constructor(
        private dialog: MatDialog,
        private ngZone: NgZone,
    ) { }

    confirm(content: string): Observable<boolean> {
        return this.ngZone.run(() => {
            const dialogRef = this.dialog.open(FuseConfirmDialogComponent, { disableClose: true });
            dialogRef.componentInstance.confirmMessage = content;
            return dialogRef.afterClosed();
        });
    }
}
