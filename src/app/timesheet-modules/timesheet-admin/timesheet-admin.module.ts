import { NgModule } from '@angular/core';

import { TimesheetAdminRoutingModule } from './timesheet-admin-routing.module';
import { TimesheetAdminListComponent } from './timesheet-admin-list/timesheet-admin-list.component';
import { TimesheetAdminUserListComponent } from './timesheet-admin-user-list/timesheet-admin-user-list.component';
import { SwipeCardComponent } from './components/swipe-card/swipe-card.component';
import { SharedTimesheetModule } from 'src/app/shared-timesheet/shared-timesheet.module';
import { TimesheetAdminWeekListComponent } from './timesheet-admin-week-list/timesheet-admin-week-list.component';


@NgModule({
  declarations: [
    TimesheetAdminListComponent,
    TimesheetAdminUserListComponent,
    SwipeCardComponent,
    TimesheetAdminWeekListComponent,
  ],
  imports: [
    SharedTimesheetModule,
    TimesheetAdminRoutingModule
  ]
})
export class TimesheetAdminModule { }