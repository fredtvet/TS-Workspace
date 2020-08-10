import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { DateTimeService } from 'src/app/core/services/utility/date-time.service';
import { OwlDateTimeComponent } from 'ng-pick-datetime';
import { TimesheetStatus, DateRangePresets } from 'src/app/shared-app/enums';
import { Mission, User } from 'src/app/core/models';
import { TimesheetFilter } from 'src/app/shared-app/interfaces';
import { TimesheetListFilter } from 'src/app/shared/timesheet-list-filter.model';

@Component({
  selector: 'app-timesheet-filter',
  templateUrl: './timesheet-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetFilterComponent {

  timesheetStatus = TimesheetStatus;
  dateRangePresets = DateRangePresets;

  @Input() missions: Mission[] = [];
  @Input() users: User[] = [];
  @Input() filterPreset: TimesheetFilter;
  @Input() disabledFilters: string[] = [];

  @Output() filterChanged = new EventEmitter();

  constructor(private dateTimeService: DateTimeService) {}

  updateDateRangePreset(preset: DateRangePresets){
    this.filterPreset.dateRangePreset = preset;
    this.filterPreset.dateRange = this.dateTimeService.getRangeByDateRangePreset(preset);
  }

  applyFilter = () => this.filterChanged.emit(this.filterPreset);
  
  reset = () => this.filterChanged.emit(new TimesheetListFilter());

  displayFnMission(mission: Mission): string {
    if(mission == undefined) return null;
    return mission.address;
  }

  chosenMonthHandler(date: Date, datepicker: OwlDateTimeComponent<Date>) {
    this.filterPreset.dateRange = this.dateTimeService.getMonthRange(date);
    datepicker.close();
  }
}