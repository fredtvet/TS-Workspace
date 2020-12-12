import { ModelFile } from '@core/models/base-entity-file.interface';
import { SaveAction } from '@model/interfaces';
import { ModelFileWrapper } from '@model/model-file.wrapper';
import { SaveModelAction } from '@model/state/save-model/save-model.action';
import { Prop } from '@state/interfaces';
import { ModelState } from '../model-state.interface';

export class SaveModelFileAction<TModel extends ModelFile> extends SaveModelAction<TModel, ModelState>{
    constructor(
        stateProp: Prop<ModelState>,
        entity: TModel,
        public fileWrapper: ModelFileWrapper,
        saveAction: SaveAction,  
        apiUrlOverride?: string,   
    ){ super(stateProp, entity, saveAction, apiUrlOverride) };
}