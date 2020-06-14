import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetAdminListComponent } from './timesheet-admin-list/timesheet-admin-list.component';
import { TimesheetAdminUserListComponent } from './timesheet-admin-user-list/timesheet-admin-user-list.component';
import { AuthGuard } from 'src/app/core/services';
import { Roles, AppPages } from 'src/app/shared-app/enums';

const routes: Routes = [
  {
    path: '',
    component: TimesheetAdminUserListComponent,
    canActivate: [AuthGuard],
    data: {allowedRoles: [Roles.Leder], page: AppPages.TimesheetAdminUserList}
  },  
  {
    path: ':userName/:year',
    component: TimesheetAdminListComponent,
    canActivate: [AuthGuard],
    data: {allowedRoles: [Roles.Leder], page: AppPages.TimesheetAdminList}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetAdminRoutingModule { }
