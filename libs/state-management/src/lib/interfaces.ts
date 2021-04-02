import { Immutable, Maybe } from 'global-types'
import { Observable } from 'rxjs'
import { StateAction } from './state.action'

/** Represents an action that has been dispatched by a {@link Store} */
export interface DispatchedAction<TAction extends StateAction, TState = {}> { 
    /** The action that was dispatched */
    action: Immutable<TAction>, 
    /** A snapshot of the state when the action was dispatched */
    stateSnapshot: Immutable<TState>
};

/** Represents a class for handling side effects on dispatched action(s).
 *  Provided with token {@link STORE_EFFECTS}
 */
export interface Effect<TAction extends StateAction> {
    /**
     * A handler function that listens to the action observer.
     * 
     * @param actions$ An action observer 
     * @returns A new action to be dispatched
     */
    handle$(actions$: Observable<DispatchedAction<TAction>>): Observable<Immutable<StateAction> | void>
    
    /**
     * If set, this action is dispatched if any errors occur in the action observer
     */
    onErrorAction?: (err: unknown) => Immutable<StateAction> | void
}

/**
 * Represents a pure function that modifies state
 * @param state
 * @param action The action that triggers the {@link Reducer}
 * @returns The modified state
 */
export type ReducerFn<TState, TAction> = (state: Immutable<TState>, action: Immutable<TAction>) => Maybe<Immutable<Partial<TState>>>

/** Represents an object used to modify state on a specified action. 
 *  Provided with token {@link STORE_REDUCERS}
*/
export interface Reducer<TState, TAction extends StateAction> {
    /** The action that triggers the reducer. */
    type: string;
    /** The reducerFn that should be triggered on specified action.  */
    reducerFn: ReducerFn<TState, TAction>;
}

/** Represents a class for intercepting actions dispatched to 
 *  the {@link Store} in its provider scope. 
 *  Provided with token {@link STORE_ACTION_INTERCEPTORS} */
export interface ActionInterceptor {
    intercept(action: Immutable<StateAction>): Maybe<StateAction>
}

/** Represents a function for intercepting reducers before they are processed.
 *  Provided with token {@link STORE_META_REDUCERS} 
 *  @param reducer A merged reducer consisting of the reducers associated with the triggering action */
export type MetaReducer<TState, TAction extends StateAction> = 
    (reducer: Immutable<Reducer<TState, TAction>>) => Reducer<TState, TAction>

/** Represents an object with store configurations.
 *  Provided with token {@link STORE_SETTINGS} */
export interface StoreSettings { 
    /** Set to true if state changes should be logged to console for debugging purposes.
     *  WARNING! Should be set to false in production builds! */
    logStateChanges?: boolean, 
    /** Set to true to freeze all actions and state. 
     *  Helps with debugging the immutability of the system. 
     *  WARNING! Should be set to false in production builds! */
    strictImmutability?: boolean; 
}