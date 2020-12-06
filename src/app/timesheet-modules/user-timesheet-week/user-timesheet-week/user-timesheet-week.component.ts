import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { DeviceInfoService } from 'src/app/core/services/device-info.service';
import { _objectToDisabledObjectMap } from 'src/app/dynamic-forms/helpers/disabled-control-map.helper';
import { DynamicForm } from 'src/app/dynamic-forms/interfaces';
import { ModelState } from 'src/app/model/interfaces';
import { _getDateOfWeek } from 'src/app/shared-app/helpers/datetime/get-date-of-week.helper';
import { _getWeekOfYear } from 'src/app/shared-app/helpers/datetime/get-week-of-year.helper';
import { _getWeekRange } from 'src/app/shared-app/helpers/datetime/get-week-range.helper';
import { _getWeeksInYear } from 'src/app/shared-app/helpers/datetime/get-weeks-in-year.helper';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';
import { WeekCriteriaForm } from 'src/app/shared/constants/forms/week-criteria-controls.const';
import { CreateUserTimesheetForm, EditUserTimesheetForm, TimesheetForm } from 'src/app/shared/constants/model-forms/save-user-timesheet-form.const';
import { FormService } from 'src/app/shared/form';
import { ModelFormService, SaveModelFormState } from 'src/app/shared/model-form';
import { WeekCriteria } from '../../shared-timesheet/interfaces';
import { UserTimesheetFormToSaveModelAdapter } from '../../shared-timesheet/state/save-user-timesheet/user-timesheet-form-to-save-model.adapter';
import { UserTimesheetCardDialogWrapperComponent } from './user-timesheet-card-dialog-wrapper.component';
import { UserTimesheetWeekProviders } from './user-timesheet-week-providers.const';
import { UserTimesheetWeekFacade } from './user-timesheet-week.facade';
import { ViewModel } from './view-model.interface';

@Component({
  selector: "app-user-timesheet-week",
  templateUrl: "./user-timesheet-week.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: UserTimesheetWeekProviders
})
export class UserTimesheetWeekComponent {

  navConfig$: Observable<MainTopNavConfig> = 
    this.facade.weekCriteria$.pipe(map(x => this.getNavConfig(x)));

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.weekDaySummaries$,
    this.deviceInfoService.isXs$
  ]).pipe(
    map(([weekDaySummaries, isXs]) => { return { isXs, weekDaySummaries, weekCriteria: this.facade.weekCriteria }}),
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private deviceInfoService: DeviceInfoService,
    private facade: UserTimesheetWeekFacade,
    private modelFormService: ModelFormService,
    private formService: FormService,
  ) {}

  nextWeek = (): void => this.facade.nextWeek()

  previousWeek = (): void => this.facade.previousWeek()

  openTimesheetForm = (entityId?: string, form?: TimesheetForm): void => {
    let dynamicForm: DynamicForm<TimesheetForm,  SaveModelFormState<Partial<ModelState>>>;
    if(!entityId) dynamicForm = {...CreateUserTimesheetForm, disabledControls: _objectToDisabledObjectMap(form)}
    else dynamicForm = EditUserTimesheetForm

    this.modelFormService.open<TimesheetForm>({
      formConfig: {
        dynamicForm: {...dynamicForm, initialValue: form}, entityId,
        adapter: UserTimesheetFormToSaveModelAdapter, 
        stateProp: "userTimesheets",    
      }, 
    })
  };

  openTimesheetCard = (timesheetId: string) =>
    this.dialog.open(UserTimesheetCardDialogWrapperComponent, {
      data: timesheetId, panelClass: 'extended-dialog'});

  private goToTimesheetList = () => {
      const {weekNr, year} = this.facade.weekCriteria;
      this.router.navigate(["liste", { 
        criteria: JSON.stringify({
            dateRange: _getWeekRange(_getDateOfWeek(weekNr, year))
        })
      }], {relativeTo: this.route});
  };

  private openWeekFilter = (): void => { 
    this.formService.open<WeekCriteria, any>({
      formConfig: {...WeekCriteriaForm, 
        disabledControls: {user: true}, 
        noRenderDisabledControls: true,  
        initialValue: this.facade.weekCriteria}, 
      navConfig: {title: "Velg filtre"},
      submitCallback: (val: WeekCriteria) => this.facade.updateCriteria(val)
    });
  }

  private getNavConfig(weekCriteria: WeekCriteria): MainTopNavConfig{
    return { 
      title:  "Uke " + weekCriteria?.weekNr || "",
      subTitle: weekCriteria?.year?.toString() || "",
      buttons: [  
        {icon: "filter_list", color: 'accent', callback: this.openWeekFilter},
        {icon: "list", callback: this.goToTimesheetList},
      ]
    }
  }
}
