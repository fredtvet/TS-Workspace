import { _deepClone } from 'src/app/shared-app/helpers/deep-clone.helper';
import { Reducer } from 'src/app/state/interfaces';
import { DispatchHttpActionId, DispatchHttpCommand } from './dispatch-http-command.interface';

export const DispatchHttpReducer: Reducer<any> = {
    actionId: DispatchHttpActionId, noDeepCloneState: true, 
    stateProperties: ['requestQueue'],
    reducerFn: (state: any, action: DispatchHttpCommand) => {
        if(!state.requestQueue) return null;
        const requestQueue = [...state.requestQueue];
        const request = requestQueue[0];
        if(request) requestQueue[0] = {...request, dispatched: true};
        return {requestQueue}
    }
}