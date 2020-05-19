import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { Timesheet, Mission } from 'src/app/shared/models';
import { debounceTime, distinctUntilChanged, tap, map, startWith, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timesheet-form-view',
  templateUrl: './timesheet-form-view.component.html',
  styleUrls: ['./timesheet-form-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetFormViewComponent implements OnInit {

  @Input() timesheet: Timesheet;
  @Input() missions: Mission[];

  @Input() datePreset: Date;
  @Input() missionPreset: Mission;

  @Output() formSubmitted = new EventEmitter();
  @Output() missionsSearch = new EventEmitter();

  timesheetForm: FormGroup;
  isCreateForm = false;

  initTime: Date = new Date();

  constructor(private _formBuilder: FormBuilder) {this.initTime.setHours(6,0,0,0);}

  ngOnInit(){
    if(this.timesheet == null){
      this.isCreateForm = true;
      this.timesheet = new Timesheet();
    }
    else this.timesheet.mission = this.missions.find(x => x.id == this.timesheet.missionId);

    this.initalizeForm();
    this.initMissionListener();
  }

  onSubmit = () => {
    if(this.timesheetForm.valid && this.timesheetForm.dirty) 
      this.formSubmitted.emit(this.convertFormToTimesheet(this.timesheetForm.getRawValue()));
  }
  
  displayMissionAddress(mission: Mission): string {
    if(mission == undefined) return null;
    return mission.address;
  }

  private initalizeForm(){
    this.timesheetForm = this._formBuilder.group({
      id: this.timesheet.id,
      mission: [{value: this.missionPreset || this.timesheet.mission, disabled: this.missionPreset}, [
        Validators.required
      ]],
      date: [{value: this.datePreset || (this.isCreateForm ? null : new Date(this.timesheet.startTime)), disabled: this.datePreset}, [
        Validators.required
      ]],
      timeRange: [this.isCreateForm ? [] : [new Date(this.timesheet.startTime), new Date(this.timesheet.endTime)], [
        Validators.required,
        this.timeRangeValidator()
      ]],
      comment: [this.timesheet.comment, [
        Validators.required,
        Validators.maxLength(400)
      ]],
    });
  }

  private initMissionListener(){
    this.mission.valueChanges.pipe(
      filter(x => typeof x == 'string'),
      debounceTime(400)
    ).subscribe(x => this.missionsSearch.emit(x))
  }

  private timeRangeValidator(): ValidatorFn{ //Check that all elements in array exist
    return (control: AbstractControl): {[key: string]: any} | null => {
      const invalid = !control.value[0] || !control.value[1];
      return invalid ? {'timeRangeInvalid': {value: control.value}} : null;
    };
  }

  private convertFormToTimesheet(formData:any){
    let timesheet = new Timesheet();   
    let date = formData.date.toDateString();
    timesheet.id = formData.id;
    timesheet.missionId = formData.mission.id;
    timesheet.comment = formData.comment;
    timesheet.startTime = new Date(date + " " + formData.timeRange[0].toTimeString());
    timesheet.endTime = new Date(date + " " + formData.timeRange[1].toTimeString());
    return timesheet;
  }

  get mission(){
    return this.timesheetForm.get('mission')
  }

  get date(){
    return this.timesheetForm.get('date')
  }

  get timeRange(){
    return this.timesheetForm.get('timeRange')
  }

  get comment(){
    return this.timesheetForm.get('comment')
  }


}