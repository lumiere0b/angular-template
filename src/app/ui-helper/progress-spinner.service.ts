import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ProgressSpinnerService {
    keys: string[] = [];
    subject: ReplaySubject<boolean> = new ReplaySubject();

    hide(key: string): void {
        const index = this.keys.indexOf(key);
        if (index === -1) {
            return;
        }
        this.keys.splice(index, 1);
        if (this.keys.length === 0) {
            this.subject.next(false);
        }
    }

    show(key: string): void {
        if (!this.keys.includes(key)) {
            this.keys.push(key);
        }
        this.subject.next(true);
    }
}
