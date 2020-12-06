import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { DynamicForm } from 'src/app/dynamic-forms/interfaces';
import { ModelState } from 'src/app/model/interfaces';
import { ActionType } from 'src/app/shared-app/enums';
import { FormComponent } from '../../form';
import { SaveAction } from '../../save-action.interface';
import { FormToSaveModelStateCommandAdapter } from '../adapters/form-to-save-model-state-command.adapter';
import { ModelFormConfig } from '../interfaces/model-form-config.interface';
import { SaveModelFormState } from '../interfaces/model-form-to-state-command-adapter.interface';
import { ModelFormFacade } from '../model-form.facade';

@Component({
    selector: 'app-model-form',
    template: `
      <app-dynamic-form 
        [config]="formConfig$ | async" 
        [formState]="formState$ | async" 
        (formSubmitted)="$event ? onSubmit($event) : onCancel()">
      </app-dynamic-form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelFormComponent implements FormComponent<ModelFormConfig<any, any>, SaveModelFormState<Partial<ModelState>>, SaveAction>{
    @Output() formSubmitted = new EventEmitter<SaveAction>()

    @Input() config: ModelFormConfig<any, any>;
   
    @Input('formState') 
    set formState(value: Object) {
      this.formStateSubject.next(value)
    }
  
    private formStateSubject = new BehaviorSubject<SaveModelFormState<Partial<ModelState>>>(null)

    formState$: Observable<SaveModelFormState<Partial<ModelState>>>;
    formConfig$: Observable<DynamicForm<any, SaveModelFormState<Partial<ModelState>>>>;

    private isCreateForm: boolean = false;
  
    constructor(private facade: ModelFormFacade) {}
  
    ngOnInit(): void {   
      if(!this.config.entityId) this.isCreateForm = true;

      this.formState$ = combineLatest([
        this.formStateSubject.asObservable(),
        this.facade.getFormState$(this.config.stateProp)
      ]).pipe(map(([inputFormState, modelFormState]) => {
        return {...modelFormState, ...inputFormState}
      }), shareReplay(1));

      this.formConfig$ = this.formState$.pipe(filter(x => x != null),take(1), 
        map(state => this.getFormConfig(state.options))
      )

    }

    onSubmit(result: any): void{   
      const saveAction = this.isCreateForm ? ActionType.Create : ActionType.Update;
      this.formSubmitted.emit(saveAction);
      const adapter = this.config.adapter || FormToSaveModelStateCommandAdapter

      this.formState$.pipe(take(1)).subscribe(state => {
        const stateCommand = new adapter({
          formState: result, 
          options: state.options,
          stateProp: this.config.stateProp, 
          saveAction, 
        })

        this.facade.save(stateCommand); 
      })    
    }

    onCancel = (): void => this.formSubmitted.emit(null); 

    private getFormConfig(state: Partial<ModelState>): DynamicForm<any, SaveModelFormState<Partial<ModelState>>>{
      const dynamicForm = this.config.dynamicForm;
      if(dynamicForm.initialValue) return this.config.dynamicForm;
      return {
        ...dynamicForm, 
        initialValue:  this.facade.getModelWithForeigns(this.config.entityId, this.config.stateProp, state)
      }
    }
}
  