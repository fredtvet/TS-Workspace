import { Immutable } from '@global/interfaces';
import { _createReducer } from '@state/helpers/create-reducer.helper';
import { SetPersistedCriticalStateAction, SetPersistedStateAction } from './actions.const';

export const SetPersistedCriticalStateReducer = _createReducer(
    SetPersistedCriticalStateAction,
    (state: unknown, action: Immutable<SetPersistedCriticalStateAction>) => action.state,
)

export const SetPersistedStateReducer = _createReducer(
    SetPersistedStateAction,
    SetPersistedCriticalStateReducer.reducerFn,
)
