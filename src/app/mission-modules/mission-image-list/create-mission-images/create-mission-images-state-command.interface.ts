import { ModelFileWrapper } from 'src/app/model/model-file.wrapper';
import { StateAction } from 'src/app/state/interfaces';

export const CreateMissionImagesActionId = "CREATE_MISSION_IMAGES";

export interface CreateMissionImagesStateCommand extends StateAction {
    fileWrappers: ModelFileWrapper[];
    missionId: string;
}