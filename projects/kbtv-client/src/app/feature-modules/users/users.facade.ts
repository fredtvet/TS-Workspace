import { Injectable } from "@angular/core";
import { _groupBy } from 'array-helpers';
import { User } from "@core/models";
import { Immutable, ImmutableArray, Maybe } from 'global-types';
import { FetchModelsAction } from "@model/state/fetch-model/fetch-models.http.effect";
import { Roles } from '@shared-app/enums';
import { Store } from 'state-management'
import { map } from "rxjs/operators";
import { StoreState } from './store-state';
import { UpdateUserPasswordAction } from './update-user-password.http.effect';

@Injectable({providedIn: 'any'})
export class UsersFacade {

  sortedUsers$ = 
    this.store.selectProperty$<User[]>("users").pipe(map(x => this.sortByRole(x)));
  
  get users() { return this.store.state.users; }

  constructor(private store: Store<StoreState>) {
    this.store.dispatch({type: FetchModelsAction, props: ["users"]})
  }

  updatePassword(userName: string, newPassword: string): void{
    this.store.dispatch(<UpdateUserPasswordAction>{ type: UpdateUserPasswordAction, newPassword, userName })
  }
  
  private sortByRole = (users: Maybe<ImmutableArray<User>>): Immutable<User>[] => {
    if(!users) return [];

    let grouped = _groupBy(users, "role"); 
    let result: Immutable<User>[] = [];

    for(let role of Object.keys(Roles).map(key => Roles[key as keyof typeof Roles])) 
      if(grouped[role]) result = result.concat(grouped[role])

    return result;
  }
}