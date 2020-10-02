import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterComponent } from 'src/app/core/services/filter/interfaces/filter-component.interface';
import { Mission, User } from 'src/app/core/models';
import { DateRangePresets } from 'src/app/shared-app/enums';
import { _getMonthRange } from 'src/app/shared-app/helpers/datetime/get-month-range.helper';
import { _getRangeByDateRangePreset } from 'src/app/shared-app/helpers/datetime/get-range-by-date-range-preset.helper';
import { TimesheetCriteria } from 'src/app/shared-timesheet/interfaces';
import { TimesheetStatus } from 'src/app/shared/enums';
import { ActiveStringFilterConfig } from 'src/app/shared/interfaces/active-string-filter-config.interface';
import { isObjectValidator } from 'src/app/shared/validators/is-object.validator';
import { TimesheetFilterViewConfig } from './timesheet-filter-view-config.interface';
import { BaseFormViewComponent } from 'src/app/core/services/form/abstracts/base-form-view-component';

@Component({
  selector: 'app-timesheet-filter-view',
  templateUrl: './timesheet-filter-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetFilterViewComponent extends BaseFormViewComponent<TimesheetFilterViewConfig, TimesheetCriteria>
  implements FilterComponent<TimesheetFilterViewConfig, TimesheetCriteria>{

  timesheetStatus = TimesheetStatus;
  dateRangePresets = DateRangePresets;

  stringFilterConfig: ActiveStringFilterConfig<Mission>;

  constructor(private _formBuilder: FormBuilder) { super(); }
  
  displayMissionAddress = (mission: Mission): string => 
    mission ? mission.address : null;

  selectMonthHandler = (date: Date): void =>  
    this.setDateRange(_getMonthRange(date))
  
  onSubmit = () => {
    const preset = this.dateRangePreset.value;

    if(preset !== DateRangePresets.Custom && preset !== DateRangePresets.CustomMonth )
      this.setDateRange(_getRangeByDateRangePreset(preset));

    const res = this.form.value;

    if(res.dateRange && (res.dateRange.start || res.dateRange.end))
      res.dateRange = [new Date(res.dateRange.start), new Date(res.dateRange.end || new Date())];
    else res.dateRange = null;

    if(this.form.valid && this.form.dirty) 
        this.formSubmitted.emit(res);
  };
  
  reset = () => {
    this.form.reset({dateRangePreset: DateRangePresets.CurrentYear});
    this.form.markAsDirty()
  }

  isFormNotEmpty = () => {
    for (var key in this.form.value) {  
      if(this.form.value[key]) return true;
    }
  }

  compareUser = (opt: User, val: User) => opt?.userName === val?.userName;

  protected _onConfigChanges(){
    super._onConfigChanges();
    this.stringFilterConfig = {
      data: this.config?.state?.missions,
      stringProps: ['id', 'address'],
      initialString: this.config?.criteria?.mission?.address, 
      stringChanges$: this.mission.valueChanges,
      maxChecks: 50,
    }
  }

  protected _initalizeForm(cfg: TimesheetFilterViewConfig): FormGroup { 
    const disabled = cfg?.disabledFilters;
    const template = cfg?.criteria || {};

    const dateRange = template?.dateRange;
    const startDateIso = dateRange && dateRange[0] ? new Date(dateRange[0]).toISOString() : null;
    const endDateIso = dateRange && dateRange[1] ? new Date(dateRange[1]).toISOString() : null;
   
    return this._formBuilder.group({
      user: [{value: template.user, disabled: disabled?.includes("user")}],
      mission: [{value: template.mission, disabled: disabled?.includes("mission")}, [
        isObjectValidator(true)
      ]],
      dateRangePreset: [{value: template.dateRangePreset, disabled: disabled?.includes("dateRangePreset")}, [
        Validators.required
      ]],
      dateRange: this._formBuilder.group({
        start: [{value: startDateIso, disabled: disabled?.includes("dateRange")}],
        end: [{value: endDateIso, disabled: disabled?.includes("dateRange")}],
      }),
      status: [{value: template.status, disabled: disabled?.includes("status")}],
    });
  }

  private setDateRange(dateRange: Date[]){
    if(!dateRange) return;
    this.dateRange.setValue({
      start: new Date(dateRange[0]).toISOString(), 
      end: new Date(dateRange[1]).toISOString()
    })
  }

  get user(){
    return this.form.get('user')
  }
  get mission(){
    return this.form.get('mission')
  }
  get dateRangePreset(){
    return this.form.get('dateRangePreset')
  }
  get dateRange(){
    return this.form.get('dateRange')
  }  
  get startDate(){
    return this.form.get(['dateRange', 'start'])
  }  
  get endDate(){
    return this.form.get(['dateRange','end'])
  }
  get status(){
    return this.form.get('status')
  }

}
