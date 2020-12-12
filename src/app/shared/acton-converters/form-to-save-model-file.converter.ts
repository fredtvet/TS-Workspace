import { Model, ModelFile } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { SaveModelFileAction } from '@core/state/save-model-file/save-model-file.action';
import { FormToSaveModelConverter, ModelFormToSaveModelInput } from '@model-form/interfaces';
import { ModelFileWrapper } from '@model/model-file.wrapper';
import { ModelStateConfig } from '@model/model-state.config';
import { _flattenExistingForeigns } from '@shared-app/helpers/flatten-existing-foreigns.helper';
import { _modelIdGenerator } from '@shared-app/helpers/id/model-id-generator.helper';

export type ModelFileForm = ModelFile & {file: File};
export const _formToSaveModelFileConverter: FormToSaveModelConverter<ModelFileForm, ModelState, SaveModelFileAction<ModelFile>> =
    <TForm extends ModelFileForm>(input: ModelFormToSaveModelInput<TForm, ModelState>): SaveModelFileAction<ModelFile> => {

    const file = input.formValue.file;
    delete input.formValue.file;
    
    var entity = _flattenExistingForeigns<ModelFile>(input.stateProp, input.formValue, input.options);
    entity = _modelIdGenerator(input.stateProp, entity); 

    const modelCfg = ModelStateConfig.get(input.stateProp);
    const fileWrapper = 
        new ModelFileWrapper(file, entity[modelCfg.identifier]);

    return new SaveModelFileAction<Model>(input.stateProp, entity, fileWrapper, input.saveAction)
}