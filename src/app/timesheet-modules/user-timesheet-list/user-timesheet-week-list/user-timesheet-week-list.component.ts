import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { FilterSheetService } from 'src/app/core/services/filter/filter-sheet.service';
import { WeekFilterViewComponent } from 'src/app/shared-timesheet/components';
import { WeekCriteria, WeekFilterViewConfig } from 'src/app/shared-timesheet/components/week-filter-view/week-filter-view-config.interface';
import { TimesheetSummary } from 'src/app/shared-timesheet/interfaces';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';
import { GroupByPeriod } from 'src/app/shared/enums';
import { UserTimesheetListStore } from '../user-timesheet-list.store';

interface ViewModel{ summaries: TimesheetSummary[], navConfig: MainTopNavConfig  }

@Component({
  selector: 'app-user-timesheet-week-list',
  templateUrl: './user-timesheet-week-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTimesheetWeekListComponent {

  vm$: Observable<ViewModel> = combineLatest([
    this.store.timesheetSummaries$.pipe(map(x => x?.sort((a,b) => b.weekNr - a.weekNr))),
    this.store.weekCriteria$.pipe(map(x => this.getNavConfig(x)))
  ]).pipe(map(([summaries, navConfig]) => {
    return { navConfig, summaries }
  }));

  constructor(
    private filterService: FilterSheetService,
    private store: UserTimesheetListStore,
    private route: ActivatedRoute,
    private router: Router) 
    { 
      this.store.addGroupBy(GroupByPeriod.Week);
      let initFilter = this.route.snapshot.params.filter;
      initFilter = initFilter ? JSON.parse(initFilter) : {year: new Date().getFullYear()};
      this.store.addWeekFilterCriteria(initFilter);
    }

  goToWeekView = (weekCriteria: WeekCriteria) => {
    this.router.navigate(['/mine-timer/ukevisning', {filter: JSON.stringify(weekCriteria)}])
  }

  openWeekFilter = () => { 
    let ref = this.filterService.open<WeekCriteria, WeekFilterViewConfig>({
      formConfig: {
        criteria: this.store.weekCriteria, 
        disabledFilters: ["weekNr","user"]
      },
      formComponent: WeekFilterViewComponent
    });

    ref.afterDismissed()
      .pipe(filter(f => f != null))
      .subscribe(f => this.store.addWeekFilterCriteria(f));
  }

  private getNavConfig = (weekCriteria: WeekCriteria): MainTopNavConfig => {  
    const year = weekCriteria?.year; 
    return {
      title:  "Ukeliste", 
      subTitle: year ? year.toString() : "",
      buttons: [{
        icon: 'filter_list', 
        callback: this.openWeekFilter,
        colorClass: "color-accent"
      }]
    }
  }
}
