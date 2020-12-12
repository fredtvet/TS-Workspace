export function _sortByBool<T>(collection: T[], prop: Extract<keyof T, string>, trueFirst?: boolean): T[]{
    if(!collection) return;
    return collection.sort((x: any, y: any) => {
        if(trueFirst) return (x[prop] === y[prop])? 0 : x[prop]? -1 : 1;
        return (x[prop] === y[prop])? 0 : x[prop]? 1 : -1;
    });
}