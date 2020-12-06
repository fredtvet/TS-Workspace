import { StoreState } from 'src/app/core/services/auth/interfaces/store-state';
import { MissionCriteria } from 'src/app/shared/interfaces';
import { Reducer, StateAction } from 'src/app/state/interfaces';

export const SetMissionCriteriaActionId = "SET_MISSION_CRITERIA";

export interface SetMissionCriteriaCommand extends StateAction { missionCriteria: MissionCriteria }

export const SetMissionCriteriaReducer: Reducer<any> = {
    actionId: SetMissionCriteriaActionId,
    reducerFn: (state: StoreState, action: SetMissionCriteriaCommand) => {
        return { missionCriteria: action.missionCriteria }
    }       
}  
