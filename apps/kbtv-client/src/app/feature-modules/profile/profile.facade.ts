import { Injectable } from "@angular/core";
import { User } from "@core/models";
import { Immutable } from "global-types";
import { AuthService } from "state-auth";
import { Store } from 'state-management';
import { ReloadSyncStateAction, SyncConfig, SyncStateAction, UpdateSyncConfigAction } from 'state-sync';
import { ClearAndLogoutAction } from "./state/clear-and-logout.action";
import { UpdateCurrentUserAction } from './state/update-current-user/update-current-user.action';
import { UpdatePasswordAction } from './state/update-password/update-password.action';
import { StoreState } from './store-state';

@Injectable({providedIn: 'any'})
export class ProfileFacade {

  get currentUser() {
    return this.store.state.currentUser
  };

  get syncConfig() {
    return this.store.state.syncConfig
  };

  constructor(
    private store: Store<StoreState>,
    private authService: AuthService
  ) {}
  
  updateCurrentUser = (user: Immutable<User>): void => 
    this.store.dispatch(<UpdateCurrentUserAction>{ type: UpdateCurrentUserAction, user });
  
  updatePassword = (oldPassword: string, newPassword: string) => 
    this.store.dispatch(<UpdatePasswordAction>{ type: UpdatePasswordAction, oldPassword, newPassword });
  
  updateSyncConfig = (syncConfig: Immutable<SyncConfig>) => 
    this.store.dispatch(<UpdateSyncConfigAction>{ type: UpdateSyncConfigAction, syncConfig, propagate: true });
  
  syncAll = () => this.store.dispatch(<SyncStateAction>{ type: SyncStateAction, propagate: true });

  reloadData = () => this.store.dispatch(<ReloadSyncStateAction>{ type: ReloadSyncStateAction, propagate: true });

  logout = () => this.authService.logout(); 

  clearAndLogout = () => {
    this.store.dispatch({type: ClearAndLogoutAction})
  }

}