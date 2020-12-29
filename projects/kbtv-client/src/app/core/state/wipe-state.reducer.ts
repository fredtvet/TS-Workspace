import { Immutable, UnknownState } from 'global-types';
import { StateAction, _createReducer } from 'state-management';

export const WipeStateAction = "WIPE_STATE_ACTION";
export interface WipeStateAction extends StateAction { defaultState: {} }

export const WipeStateReducer = _createReducer(
    WipeStateAction, 
    (state: Immutable<{}>, action: Immutable<WipeStateAction>): {} => {
        const ignoredState: UnknownState = {refreshToken: true, accessToken: true, currentUser: true};
        
        const deleteState: UnknownState = {};

        for(const key in state)
          if(!ignoredState[key]) deleteState[key] = undefined;

        return {...deleteState, ...(action.defaultState || {})}
    }
)

