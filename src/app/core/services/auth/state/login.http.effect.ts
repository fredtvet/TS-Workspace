import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/core/api-url.enum';
import { ApiService } from 'src/app/core/services/api.service';
import { DispatchedAction } from 'src/app/state/action-dispatcher';
import { StateAction } from 'src/app/state/interfaces';
import { Effect } from 'src/app/state/interfaces/effect.interface';
import { listenTo } from 'src/app/state/operators/listen-to.operator';
import { Credentials } from '../interfaces';
import { LoginSuccessActionId, LoginSuccessCommand } from './login-success/login-success-command.interface';

export const LoginActionId = "LOGIN";

export interface LoginCommand extends StateAction { credentials: Credentials, returnUrl?: string }

@Injectable()
export class LoginHttpEffect implements Effect<LoginCommand> {

    constructor(private apiService: ApiService){}

    handle$(actions$: Observable<DispatchedAction<LoginCommand>>): Observable<StateAction> {
        return actions$.pipe(
            listenTo([LoginActionId]),
            exhaustMap(x => this.login$(x)),
        )
    }

    private login$(dispatched: DispatchedAction<LoginCommand>): Observable<LoginSuccessCommand> {
        return this.apiService.post(ApiUrl.Auth + '/login', dispatched.action.credentials).pipe(
            map(x => { return <LoginSuccessCommand>{
                actionId: LoginSuccessActionId, 
                previousUser: dispatched.stateSnapshot.currentUser,
                ...x, 
            }})
        )
    }
}