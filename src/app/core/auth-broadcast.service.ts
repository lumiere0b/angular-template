import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface BroadcastMessage {
    type: AUTH_BROADCAST_TYPE | AUTH_REQUEST_BROADCAST_TYPE;
    data?: any;
}

export enum AUTH_BROADCAST_TYPE {
    SIGNED_IN,
    SIGNED_OUT
}

export enum AUTH_REQUEST_BROADCAST_TYPE {
    SIGNOUT
}

@Injectable()
export class AuthBroadcastService {
    broadcast$: BehaviorSubject<BroadcastMessage> = new BehaviorSubject({
        type: AUTH_BROADCAST_TYPE.SIGNED_OUT
    });
    request$: Subject<BroadcastMessage> = new Subject();

    broadcast(type: AUTH_BROADCAST_TYPE, data?: any): void {
        this.broadcast$.next({ type, data });
    }

    request(type: AUTH_REQUEST_BROADCAST_TYPE, data?: any): void {
        this.request$.next({ type, data });
    }
}
