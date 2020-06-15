import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserTimesheetService } from 'src/app/core/services';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-timesheet-card-dialog-wrapper',
  template: `
  <app-timesheet-card 
    [timesheet]="timesheet$ | async" 
    (deleteClicked)="deleteTimesheet()">
  </app-timesheet-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TimesheetCardDialogWrapperComponent {

  timesheet$ = this.userTimesheetService.getWithMission$(this.timesheetId).pipe(catchError(x => {this.dialogRef.close;return of(null)}));

  constructor(
    private userTimesheetService: UserTimesheetService,
    public dialogRef: MatDialogRef<TimesheetCardDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetId: number
    ) {}

  deleteTimesheet(){
    this.userTimesheetService.delete$(this.timesheetId)
      .subscribe(x => this.dialogRef.close());
  }
}