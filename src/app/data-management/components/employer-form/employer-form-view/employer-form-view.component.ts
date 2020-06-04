import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employer } from 'src/app/shared/models';

@Component({
  selector: 'app-employer-form-view',
  templateUrl: './employer-form-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployerFormViewComponent implements OnInit
{
  @Input() employer: Employer;
  @Output() formSubmitted = new EventEmitter();

  googleOptions = {
    types: ['geocode'],
    componentRestrictions: { country: "no" }
  }

  employerForm: FormGroup;
  isCreateForm: boolean = true;

  constructor(
    private _formBuilder: FormBuilder){ }

    ngOnInit(){
      if(!this.employer) this.employer = new Employer();
      else this.isCreateForm = false;
      
      this.initalizeForm();
    }
    

    initalizeForm(){
      this.employerForm = this._formBuilder.group({
        id: this.employer.id,
        name: [this.employer.name, [
          Validators.required,
          Validators.maxLength(200)
        ]],
        phoneNumber: [this.employer.phoneNumber, [
          Validators.minLength(4),
          Validators.maxLength(12)
        ]],
        address: [this.employer.address, [
          Validators.maxLength(100)
        ]],   
        email: [this.employer.email, [
          Validators.required,
          Validators.email
        ]],
      });
    }

    onSubmit(){
      const {value, valid} = this.employerForm;
      if(valid && this.employerForm.dirty) this.formSubmitted.emit(value);
    }

    handleAddressChange(googleAddress){
      this.employerForm.controls['address']
        .setValue(googleAddress.formatted_address);
    }

    get name(){
      return this.employerForm.get('name')
    }

    get phoneNumber(){
      return this.employerForm.get('phoneNumber')
    }

    get address(){
      return this.employerForm.get('address')
    }
    get email(){
      return this.employerForm.get('email')
    }
}
