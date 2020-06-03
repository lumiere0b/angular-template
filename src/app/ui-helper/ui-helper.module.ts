import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';

import { FuseConfirmDialogModule } from '@fuse/components';

import { ConfirmDialogService } from './confirm-dialog.service';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { ProgressSpinnerService } from './progress-spinner.service';
import { SnackBarService } from './snack-bar.service';

@NgModule({
    declarations: [
        ProgressSpinnerComponent
    ],
    imports: [
        CommonModule,

        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,

        FuseConfirmDialogModule
    ],
    providers: [
        ConfirmDialogService,
        ProgressSpinnerService,
        SnackBarService
    ],
    exports: [
        ProgressSpinnerComponent
    ]
})
export class UiHelperModule { }
