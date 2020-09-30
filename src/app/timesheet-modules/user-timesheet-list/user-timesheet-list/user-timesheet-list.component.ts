import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FilterConfig } from 'src/app/core/filter/interfaces/filter-config.interface';
import { FilteredResponse } from 'src/app/core/filter/interfaces/filtered-response.interface';
import { Timesheet } from "src/app/core/models";
import { FilterSheetService } from 'src/app/core/services/filter';
import { DateRangePresets } from 'src/app/shared-app/enums';
import { AppButton } from 'src/app/shared-app/interfaces';
import { TimesheetFilterViewConfig } from 'src/app/shared-timesheet/components/timesheet-filter-view/timesheet-filter-view-config.interface';
import { TimesheetFilterViewComponent } from 'src/app/shared-timesheet/components/timesheet-filter-view/timesheet-filter-view.component';
import { TimesheetCriteria } from 'src/app/shared-timesheet/interfaces';
import { MainTopNavConfig } from 'src/app/shared/interfaces';
import { ViewModel } from 'src/app/shared/interfaces/view-model.interface';
import { TrackByModel } from 'src/app/shared/trackby/track-by-model.helper';
import { TimesheetForm } from '../../user-timesheet-form/user-timesheet-form-view/timesheet-form.interface';
import { UserTimesheetListStore } from '../user-timesheet-list.store';

@Component({
  selector: "app-user-timesheet-list",
  templateUrl: "./user-timesheet-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTimesheetListComponent implements OnInit {

  vm$: Observable<ViewModel<Timesheet[]>> = this.store.filteredTimesheets$.pipe(
    map(x => { return {
      navConfig: this.getTopNavConfig(x),
      content: x.records,
    }})
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterSheetService,
    private store: UserTimesheetListStore
  ) {}

  ngOnInit() { 
    let initFilter = this.route.snapshot.params.initialFilter;

    const criteria: TimesheetCriteria = initFilter ? JSON.parse(initFilter) : {};

    if(criteria.dateRange && !criteria.dateRangePreset) 
      criteria.dateRangePreset = DateRangePresets.Custom

    this.store.addFilterCriteria(criteria);
  }

  openTimesheetForm = (entityId?: string, lockedValues?: TimesheetForm) => 
    this.router.navigate(['skjema', {config: JSON.stringify({formConfig: {entityId, viewConfig: {lockedValues}}})}], {relativeTo: this.route});

  openFilterSheet = (): void => {
    this.filterService.open<TimesheetCriteria, FilterConfig<TimesheetFilterViewConfig>>(
      {formConfig:{  
        filterConfig: {
            disabledFilters: ['userName'], 
        },
        viewComponent: TimesheetFilterViewComponent
    }});
  }
  
  trackByTimesheet = TrackByModel("timesheets")

  private onBack = () => {
    let returnUrl: string = this.route.snapshot.params.returnUrl;
    if(returnUrl) this.router.navigateByUrl(returnUrl);
    else this.router.navigate(["/hjem"]);
  }

  private getTopNavConfig = (res: FilteredResponse<TimesheetCriteria, Timesheet>): MainTopNavConfig => {
    return {
      title:  "Timeliste", 
      backFn: this.onBack,
      fabs: [
        {icon: "add", aria: 'Legg til', colorClass: 'bg-accent', 
          callback: () => this.openTimesheetForm(null, {mission: res?.criteria?.mission})}
      ],
      buttons: [{
        icon: 'filter_list', 
        callback: this.openFilterSheet,
        colorClass: (res && res.activeCriteriaCount && res.activeCriteriaCount > 0) ? "color-accent" : ""
      }]
    }
  }

}
