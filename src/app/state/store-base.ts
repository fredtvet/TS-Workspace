import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WithUnsubscribe } from 'src/app/shared-app/mixins/with-unsubscribe.mixin';
import { Prop } from 'src/app/shared-app/prop.type';
import { _groupBy } from '../shared-app/helpers/array/group-by.helper';
import { ActionDispatcher } from './action-dispatcher';
import { _getReducerStateProps } from './helpers/get-reducer-state-props.helper';
import { _reduceStateFunc } from './helpers/reduce-state-func.helper';
import { tryWithLogging } from './helpers/try-log-error.helper';
import { Reducer, ReducerMap, StateAction, StateChanges, StoreSettings } from './interfaces';
import { selectProp, selectSlice } from './operators/selectors.operator';
import { QueryDispatcher } from './query-dispatcher';
import { StateBase } from './state-base';
import { Store } from './store';

export type stateFunc<T> = (state: Partial<T>) => Partial<T>;

export abstract class StoreBase<TState> extends WithUnsubscribe() {

    private reducerMap: ReducerMap = {};

    private _settings: StoreSettings;

    stateChanges$: Observable<StateChanges<any>> = this.base.stateChanges$;
    
    constructor(
        private base: StateBase,
        private hostStore: Store<any>,
        private queryDispatcher: QueryDispatcher,
        private actionDispatcher: ActionDispatcher,
        reducers: Reducer<any>[],
        settings?: StoreSettings,
    ) { 
        super();
        this.reducerMap = _groupBy(reducers, "actionId");
        this._settings = { logStateChanges: false, ...(settings || {}) };
    }

    dispatch<TAction extends StateAction>(action: TAction): void {
        if (!action?.actionId) console.error("No action or action id was provided");
        const stateSnapshot = this.base.getStoreState(null, false);
        this.reduceState(action);
        this.actionDispatcher.dispatch(action, stateSnapshot);
        if(this.hostStore && action.propagate) this.hostStore.dispatch(action);
    }

    select$(props: Prop<TState>[], deepClone: boolean = true): Observable<Partial<TState>>{
        this.dispatchQuery(props)   
        return this.stateChanges$.pipe(selectSlice<TState>(props, deepClone))
    }

    selectProperty$<TResult>(prop: Prop<TState>, deepClone: boolean = true): Observable<TResult>{
        this.dispatchQuery([prop])
        return this.stateChanges$.pipe(selectProp<TResult>(prop, deepClone))
    }

    select(props: Prop<TState>[], deepClone: boolean = true): Partial<TState>{
        this.dispatchQuery(props)
        return this.base.getStoreState(props, deepClone);
    }

    selectProperty<TResult>(prop: Prop<TState>, deepClone: boolean = true): TResult{
        this.dispatchQuery([prop])
        const state = this.base.getStoreState([prop], deepClone);
        return state ? state[prop] : null;
    }

    private reduceState(action: StateAction): void{
        const actionReducers = this.reducerMap[action?.actionId];
        if(!actionReducers?.length) return;

        const reduceFunc = _reduceStateFunc(actionReducers, action);
        const props = _getReducerStateProps(actionReducers, action); 

        const state = this.base.getStoreState((props === "all") ? null : props);

        var newState = tryWithLogging(() => reduceFunc(state));
        
        this.setState(newState, null, false) 
    }

    private dispatchQuery = (props: Prop<TState>[]): void => 
        this.queryDispatcher.dispatch({ props });

    private setState(state: Partial<TState>, 
        action?: string, 
        deepCloneState: boolean = true) : void { 
        
        this.base.setStoreState(state, action, deepCloneState);

        if (this._settings.logStateChanges) {
            const caller = (this.constructor) ? '\r\nCaller: ' + this.constructor.name : '';
            console.log('%cSTATE CHANGED', 'font-weight: bold', '\r\nAction: ', action, caller, '\r\nState: ', state);
        }
    }

}
