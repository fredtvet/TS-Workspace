import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  constructor() { }

  add(key:string, data: any){
    console.log(data);
    window.localStorage.setItem(key, JSON.stringify(data))
  }

  get(key:string): any{
    return JSON.parse(window.localStorage.getItem(key));
  }
}
