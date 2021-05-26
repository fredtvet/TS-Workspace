import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RolePermissions } from "@core/configurations/role-permissions.const";
import { Employer, Mission, MissionType } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { _criteriaChipsFactory } from "@shared-app/helpers/chips/criteria-chips-factory.helper";
import { AppChip } from '@shared-app/interfaces/app-chip.interface';
import { WithUnsubscribe } from "@shared-app/mixins/with-unsubscribe.mixin";
import { SearchBarConfig } from "@shared-mission/components/search-bar/search-bar-config.interface";
import { MissionCriteriaFormSheet } from '@shared-mission/forms/mission-criteria-form.const';
import { CreateMissionModelForm } from "@shared-mission/forms/save-mission-model-form.const";
import { _missionCriteriaChipsFactory } from "@shared-mission/mission-criteria-chips-factory.helper";
import { AppButton } from "@shared/components/app-button/app-button.interface";
import { BottomBarIconButton } from "@shared/components/bottom-action-bar/bottom-bar-icon-button.interface";
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { BottomIconButtons } from "@shared/constants/bottom-icon-buttons.const";
import { MissionCriteria } from "@shared/interfaces/mission-criteria.interface";
import { MissionFilter } from "@shared/mission-filter.model";
import { _filter } from "array-helpers";
import { FormService } from "form-sheet";
import { Immutable, Maybe, Prop } from "global-types";
import { _getModelDisplayValue } from 'model/core';
import { ModelFormService } from 'model/form';
import { combineLatest, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { MissionListFacade } from '../mission-list.facade';
import { MissionListProviders } from './mission-list-providers.const';

interface ViewModel{ 
  criteriaChips?: AppChip[], 
  missions: Immutable<Mission>[]
}

@Component({
  selector: "app-mission-list",
  templateUrl: "./mission-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: MissionListProviders,
})
export class MissionListComponent extends WithUnsubscribe(){

  private partialVm$ = this.facade.criteria$.pipe(map(criteria => { return {
    criteria,
    criteriaChips: _missionCriteriaChipsFactory(criteria, (x) => this.facade.addCriteria(x))
  }}));

  topNavConfig: MainTopNavConfig = {title: "Oppdrag" };

  vm$: Observable<ViewModel> = combineLatest([
    this.partialVm$,
    this.facade.missions$
  ]).pipe(
    map(([vm, missions]) => { 
      const filter = new MissionFilter(vm.criteria, undefined, true)
      return { ...vm, missions: _filter(missions, (entity) => filter.check(entity)) } 
    })
  );

  actionFab: AppButton;
  
  searchBar: SearchBarConfig; 

  searchBarBtns: AppButton[];

  bottomActions: BottomBarIconButton[];

  searchBarHidden: boolean = true;

  constructor(
    private formService: FormService,
    private modelFormService: ModelFormService<ModelState>,
    private facade: MissionListFacade,
  ) {
    super();

    this.bottomActions = [
      {...BottomIconButtons.Filter, callback: this.openMissionFilter},
      {...BottomIconButtons.Search, callback: this.toggleSearchBar}
    ]

    this.actionFab = {
      icon: "add", aria: "Legg til", color: "accent",
      callback: this.openMissionForm,
      allowedRoles: RolePermissions.MissionList.create
    };

    this.searchBar = {
      searchCallback: this.searchMissions,
      initialValue: this.facade.criteria?.searchString,
      placeholder: "Søk med adresse eller id",
    };

    this.searchBarBtns = [{aria: "Lukk", icon: "close", callback: this.toggleSearchBar}]
  }

  searchMissions = (searchString: string) => 
    this.facade.addCriteria({ ...this.facade.criteria, searchString });

  toggleSearchBar = () => this.searchBarHidden = !this.searchBarHidden;

  private openMissionForm = () => 
    this.modelFormService.open(CreateMissionModelForm)

  private openMissionFilter = () => 
    this.formService.open(
      MissionCriteriaFormSheet, 
      { initialValue: this.facade.criteria, formState: this.facade.criteriaFormState$ },
      (val) => this.facade.addCriteria(val)
    );   

}
