import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROLES, MissionReportType } from 'src/app/shared';
import { ReportTypeService } from 'src/app/core';
import { SubscriptionComponent } from 'src/app/subscription.component';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-mission-report-form',
  templateUrl: './mission-report-form.component.html'
})

export class MissionReportFormComponent extends SubscriptionComponent {
  public ROLES = ROLES;

  reportForm: FormGroup;

  public files: FileList;
  public types: MissionReportType[]

  constructor(
    public dialogRef: MatDialogRef<MissionReportFormComponent>,
    private _formBuilder: FormBuilder,
    private reportTypeService: ReportTypeService,
    ) { super() }

  ngOnInit() {

    this.reportTypeService.getAll$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {this.types = data});

    this.reportForm = this._formBuilder.group({
      reportType: this._formBuilder.group({
        id: [],
        name: [null, [
          Validators.required,
          Validators.maxLength(45)
        ]],
      }),
    });
  }

  onSubmit(){

    let existingReportType =
        this.types.find(x => x.name === this.reportTypeName.value);

    if(existingReportType)
      this.reportTypeId.setValue(existingReportType.id);

    const value = { files: this.files, reportType: this.reportType.value };
    if(this.reportForm.dirty && this.files != null && this.files.length > 0)
      this.dialogRef.close(value);
  }

  changeFile(e){
    this.files = e.target.files;
  }

  get reportType(){
    return this.reportForm.get('reportType')
  }

  get reportTypeId(){
    return this.reportForm.get(['reportType','id'])
  }

  get reportTypeName(){
    return this.reportForm.get(['reportType','name'])
  }
}
