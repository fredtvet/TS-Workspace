import { Immutable, ImmutableArray, Maybe, Prop } from 'global-types';
import { _convertArrayToObject } from './convert-array-to-object.helper';

/**
 * Merge two arrays of objects, updating any objects that overlap
 * @param originals The original array of objects that may be overriden
 * @param newEntities The new array of objects that should be added 
 * @param idProp A property on the object that uniquely identifies it
 */
export function _addOrUpdateRange<T>(
    originals: Maybe<ImmutableArray<T>>, 
    newEntities: Maybe<ImmutableArray<T>>, 
    idProp: Prop<Immutable<T>>): Immutable<T>[]{   

    if(!newEntities?.length) return originals?.slice() || []; //If no entities, just return current val
    if(!originals?.length) return newEntities.slice(); //If initial array empty, just return empty array

    let originalsObj = _convertArrayToObject(originals, idProp);

    for(let i = 0; i < newEntities.length; i++){  
      let newObj = newEntities[i];
      const itemKey = idProp ? newObj[idProp] : newObj; //Use idProp as key else obj
      let existingObj = originalsObj[<string> itemKey]; //Grab existing obj
      if(existingObj) originalsObj[<string> itemKey] = {...existingObj, ...newObj}; //If obj exist, update it with new obj
      else originalsObj[<string> itemKey] = newObj;    
    } 

    let result: Immutable<T>[] = [];
    let keys = Object.keys(originalsObj);
    
    for(let i = 0; i < keys.length;i++){
      result.push(<Immutable<T>> originalsObj[keys[i]]);
    }

    return result;
}