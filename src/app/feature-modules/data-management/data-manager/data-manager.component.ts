import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogService } from 'src/app/modules/confirm-dialog/confirm-dialog.service';
import { Prop } from '@state/interfaces';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { translations } from '@shared/translations';
import { STORE_REDUCERS } from '@state/constants/injection-tokens.const';
import { ComponentStoreProviders } from '@state/constants/providers.const';
import { DataConfig } from '../interfaces/data-config.interface';
import { DataManagerFacade } from './data-manager.facade';
import { DataTableComponent } from './data-table/data-table.component';
import { PropertyFormMap } from './property-form.map';
import { UpdateSelectedPropertyReducer } from './state/update-selected-property.reducer';
import { ModelState } from '@core/state/model-state.interface';
import { ModelFormService } from '@model-form/model-form.service';

type ViewModel = {navConfig: MainTopNavConfig} & DataConfig

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DataManagerFacade,
    ...ComponentStoreProviders,
    {provide: STORE_REDUCERS, useValue: UpdateSelectedPropertyReducer, multi: true}
  ]
})
export class DataManagerComponent {
@ViewChild('dataTable') dataTable: DataTableComponent;

vm$:Observable<ViewModel> = combineLatest([
  this.facade.dataConfig$,
  this.facade.selectedProperty$.pipe(map(x => this.getNavConfig(x)))
]).pipe(
  map(([dataConfig, navConfig]) => { return {...dataConfig, navConfig}})
);

properties = this.facade.properties;

constructor(
  private facade: DataManagerFacade,
  private confirmService: ConfirmDialogService,
  private formService: ModelFormService) { }

  updateSelectedProperty = (prop: Prop<ModelState>) => 
    this.facade.updateSelectedProperty(prop);
  
  updateItem(command: any): void{
    if(!command || command === null) return;
    this.facade.update(command.data); 
  }

  private openDeleteDialog = (): void => {
    let nodes = this.dataTable.dataGrid.api.getSelectedNodes();
    if(nodes?.length == 0) return;
    const translatedProp = translations[this.facade.selectedProperty.toLowerCase()]?.toLowerCase();
    this.confirmService.open({
      title: `Slett ${nodes.length > 1 ? 'ressurser' : 'ressurs'}?`,
      message: `Bekreft at du ønsker å slette ${nodes.length} ${translatedProp}`,  
      confirmText: 'Slett',
      confirmCallback: () => this.deleteItems(nodes.map(node => node.data['id']))
    })
  }

  private openCreateForm = (): void => {
    this.formService.open({formConfig: {
      stateProp: this.facade.selectedProperty,    
      dynamicForm: PropertyFormMap[this.facade.selectedProperty]
    }})
  }

  private deleteItems(ids: string[]): boolean{
    if(ids?.length == 0) return false;
    this.facade.delete({ids});   
  }

  private getNavConfig(selectedProp: string){
    return { 
      title: "Data", 
      buttons: selectedProp ? [
        {icon: "add", callback: this.openCreateForm},
        {icon: "delete_forever", callback: this.openDeleteDialog} 
      ] : null
    };
  }
}
