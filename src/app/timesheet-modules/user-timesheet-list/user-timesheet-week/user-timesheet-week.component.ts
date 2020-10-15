import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { DeviceInfoService } from 'src/app/core/services/device-info.service';
import { ModelFormService } from 'src/app/core/services/model/form/model-form.service';
import { _getDateOfWeek } from 'src/app/shared-app/helpers/datetime/get-date-of-week.helper';
import { _getWeekOfYear } from 'src/app/shared-app/helpers/datetime/get-week-of-year.helper';
import { _getWeekRange } from 'src/app/shared-app/helpers/datetime/get-week-range.helper';
import { _getWeeksInYear } from 'src/app/shared-app/helpers/datetime/get-weeks-in-year.helper';
import { _mapObjectsToWeekdays } from 'src/app/shared-app/helpers/object/map-objects-to-weekdays.helper';
import { WeekCriteria } from 'src/app/shared-timesheet/components/week-filter-view/week-filter-view-config.interface';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';
import { GroupByPeriod } from 'src/app/shared/enums';
import { _trackByModel } from 'src/app/shared/trackby/track-by-model.helper';
import { UserTimesheetCardDialogWrapperComponent } from '../user-timesheet-card-dialog-wrapper.component';
import { TimesheetForm } from '../user-timesheet-form-view/timesheet-form.interface';
import { UserTimesheetFormToSaveModelAdapter } from '../user-timesheet-form-view/user-timesheet-form-to-save-model.adapter';
import { UserTimesheetFormViewComponent } from '../user-timesheet-form-view/user-timesheet-form-view.component';
import { UserTimesheetListStore } from '../user-timesheet-list.store';
import { ViewModel } from './view-model.interface';

@Component({
  selector: "app-user-timesheet-week",
  templateUrl: "./user-timesheet-week.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTimesheetWeekComponent {

  currentWeekNr: number = _getWeekOfYear();
  currentYear: number = new Date().getFullYear();

  get weekCriteria(): WeekCriteria { return this.store.weekCriteria };

  vm$: Observable<ViewModel> = combineLatest([
    this.store.timesheetSummaries$.pipe(map(x => _mapObjectsToWeekdays(x, "date"))),
    this.store.weekCriteria$.pipe(map(x => [x, this.getNavConfig(x) as any])),
    this.deviceInfoService.isXs$
  ]).pipe(
    map(([summaries, [weekCriteria, navConfig], isXs]) => { return { navConfig, isXs, summaries, weekCriteria }}),
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private deviceInfoService: DeviceInfoService,
    private store: UserTimesheetListStore,
    private modelFormService: ModelFormService
  ) {
    this.store.addGroupBy(GroupByPeriod.Day) 
    let initFilter = this.route.snapshot.params.filter;
    initFilter = initFilter ? JSON.parse(initFilter) : {year: this.currentYear, weekNr: this.currentWeekNr};
    this.store.addWeekFilterCriteria(initFilter);
   }

  nextWeek(): void{
    let currFilter = this.weekCriteria;
    if(currFilter.year >= this.currentYear && currFilter.weekNr >= this.currentWeekNr) return;

    if(currFilter.weekNr >= _getWeeksInYear(currFilter.year)){   
      currFilter.year++; //New year if week nr is over total weeks for year
      currFilter.weekNr = 1; //Start of new year     
    }
    else currFilter.weekNr++;

    this.store.addWeekFilterCriteria(currFilter);
  }

  previousWeek(): void{
    let currFilter = this.weekCriteria;
    if(currFilter.weekNr <= 1) {
      currFilter.year--; //Go to previous year if new week is less than 1
      currFilter.weekNr = _getWeeksInYear(currFilter.year); //Set to max week in previous year
    }
    else currFilter.weekNr--;  
    this.store.addWeekFilterCriteria(currFilter);
  }

  openTimesheetForm = (entityId?: string, lockedValues?: TimesheetForm): void => {
    this.modelFormService.open({formConfig: {
      viewComponent: UserTimesheetFormViewComponent, 
      adapter: UserTimesheetFormToSaveModelAdapter, 
      stateProp: "userTimesheets",
      entityId, 
      viewConfig: {lockedValues}
    }})
  };

  openTimesheetCard = (timesheetId: string) =>
    this.dialog.open(UserTimesheetCardDialogWrapperComponent, {
      data: timesheetId, panelClass: 'extended-dialog'});

  trackByTimesheet = _trackByModel("timesheets");

  private goToTimesheetList = () => {
      const dp = this.weekCriteria;
      this.router.navigate([
        "mine-timer/liste",
        {
          returnUrl: this.router.url,
          filter: JSON.stringify({
            dateRange: _getWeekRange(_getDateOfWeek(dp.weekNr, dp.year))
          })
        }
      ]);
  };

  private goToWeekList = () => 
    this.router.navigate(['mine-timer/ukeliste', {filter: JSON.stringify({year: this.weekCriteria?.year})}])

  private getNavConfig(weekCriteria: WeekCriteria): MainTopNavConfig{
    return { 
      title:  "Uke " + weekCriteria?.weekNr || "",
      subTitle: weekCriteria?.year?.toString() || "",
      backFn: this.goToWeekList,
      buttons: [{icon: "list", callback: this.goToTimesheetList}]
    }
  }
}