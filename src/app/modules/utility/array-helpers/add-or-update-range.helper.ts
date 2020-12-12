import { _convertArrayToObject } from './convert-array-to-object.helper';

export function _addOrUpdateRange<T>(originals: ReadonlyArray<T>, newEntities: ReadonlyArray<T>, identifier: string): T[]{       
    if(!newEntities || newEntities.length == 0) return originals?.slice(); //If no entities, just return current val
    if(!originals || originals.length == 0) return newEntities.slice(); //If initial array empty, just return empty array

    let originalsObj = _convertArrayToObject(originals, 'id');

    for(let i = 0; i<newEntities.length; i++){  
      let newObj = newEntities[i];
      const itemKey = identifier ? newObj[identifier] : newObj; //Use identifier as key else obj
      let existingObj = originalsObj[itemKey]; //Grab existing obj
      if(existingObj) Object.assign(existingObj, newObj); //If obj exist, update it with new obj
      else originalsObj[itemKey] = newObj;    
    } 

    let result: T[] = [];
    let keys = Object.keys(originalsObj);
    
    for(let i = 0; i < keys.length;i++){
      result.push(originalsObj[keys[i]]);
    }

    return result;
}