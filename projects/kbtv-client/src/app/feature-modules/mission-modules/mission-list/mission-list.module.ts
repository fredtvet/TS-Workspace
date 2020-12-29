import { NgModule } from '@angular/core';
import { AppSaveModelProviders, SaveModelFileProviders } from '@core/state/providers.const';
import { ModelFormModule } from '@model-form/model-form.module';
import { DeleteModelProviders } from '@model/state/providers.const';
import { _formToSaveModelConverter } from '@shared/acton-converters/form-to-save-model.converter';
import { AppFileUrlPipe } from '@shared/pipes/app-file-url.pipe';
import { SharedModule } from '@shared/shared.module';
import { STORE_REDUCERS } from 'state-management'
import { MissionDetailsViewComponent } from './mission-details/mission-details-view/mission-details-view.component';
import { MissionDetailsComponent } from './mission-details/mission-details.component';
import { MissionListRoutingModule } from './mission-list-routing.module';
import { MissionListViewComponent } from './mission-list/mission-list-view/mission-list-view.component';
import { MissionListComponent } from './mission-list/mission-list.component';
import { UpdateLastVisitedReducer } from './update-last-visited.reducer';

@NgModule({
  declarations: [
    MissionDetailsComponent,
    MissionDetailsViewComponent,
    MissionListComponent,
    MissionListViewComponent, 
  ],
  providers: [
    AppFileUrlPipe,
    ...SaveModelFileProviders,
    ...AppSaveModelProviders,
    ...DeleteModelProviders,
    {provide: STORE_REDUCERS, useValue: UpdateLastVisitedReducer, multi: true}
  ],
  imports: [
    SharedModule,
    MissionListRoutingModule,
    ModelFormModule.forFeature(_formToSaveModelConverter),
  ]
})
export class MissionListModule {}