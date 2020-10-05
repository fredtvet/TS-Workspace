import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';
import { FormService } from 'src/app/core/services/form/form.service';
import { ModelFormService } from 'src/app/core/services/model/form/model-form.service';
import { ButtonTypes, Roles } from 'src/app/shared-app/enums';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';
import { TrackByModel } from 'src/app/shared/trackby/track-by-model.helper';
import { NewPasswordFormComponent } from '../new-password-form/new-password-form.component';
import { UserFormViewConfig } from '../user-form-view/user-form-view-config.interface';
import { UserFormViewComponent } from '../user-form-view/user-form-view.component';
import { UsersStore } from '../users.store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  Roles = Roles;
  ButtonTypes = ButtonTypes;

  users$: Observable<User[]> = this.store.sortedUsers$;
  navConfig: MainTopNavConfig;

  constructor(
    private store: UsersStore,
    private modelFormService: ModelFormService,
    private formService: FormService) {
      this.navConfig = {
        title:  "Brukere",
        buttons: [{
          icon: "person_add", 
          colorClass: "color-accent",
          aria: 'Ny bruker',
          callback: this.openUserForm, 
          allowedRoles: [Roles.Leder]
        }]
      };
    }

  openUserForm = (userName?: string) => 
    this.modelFormService.open({formConfig: {
        entityId: userName, 
        stateProp: "users", 
        viewComponent: UserFormViewComponent,
        viewConfig: {users: this.store.users} as UserFormViewConfig
      }});

  openNewPasswordForm = (userName?: string) => 
    this.formService.open({
      formConfig: {userName}, 
      title: "Oppdater passord", 
      formComponent: NewPasswordFormComponent
    })

  trackByUser = TrackByModel("users")

}
