import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DispatchedAction } from 'src/app/state/action-dispatcher';
import { Effect } from 'src/app/state/interfaces/effect.interface';
import { listenTo } from 'src/app/state/operators/listen-to.operator';
import { HttpQueuer } from '../../http.queuer';
import { HttpQueuePushActionId, HttpQueuePushCommand } from './http-queue-push-command.interface';

@Injectable()
export class HttpQueuePushEffect implements Effect<HttpQueuePushCommand> {

    constructor(private httpQueuer: HttpQueuer) {  }

    handle$(actions$: Observable<DispatchedAction<HttpQueuePushCommand>>): Observable<void> {
        return actions$.pipe(
            listenTo([HttpQueuePushActionId], false),
            map(x => {
                if(!x.stateSnapshot.requestQueue?.length)
                    this.httpQueuer.next();
            })
        )
    }

}