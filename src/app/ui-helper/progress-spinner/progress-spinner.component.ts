import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProgressSpinnerService } from '../progress-spinner.service';

@Component({
    selector: 'app-progress-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnDestroy, OnInit {
    shown = false;
    private _unsubscribeAll: Subject<any>;

    constructor(private service: ProgressSpinnerService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.service.subject
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((shown) => this.shown = shown);
    }
}
