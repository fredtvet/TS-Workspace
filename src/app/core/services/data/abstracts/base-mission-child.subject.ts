
import { BaseSubject } from './base.subject';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../local-storage.service';
import { MissionChild } from 'src/app/shared/interfaces';
import { ArrayHelperService } from '../../utility/array-helper.service';

export abstract class BaseMissionChildSubject<T extends MissionChild> extends BaseSubject<T> {
  constructor( 
    arrayHelperService: ArrayHelperService,
    localStorageService: LocalStorageService,
    storageKey: string,
    ) { super(arrayHelperService, localStorageService, storageKey); }

  getByMissionId$(missionId: number): Observable<T[]>{
    return super.getBy$(x => x.missionId == missionId);
  }

  deleteByMissionId$(missionId: number): void{
    let arr = [...this.dataSubject.value];
    
    arr = arr.filter(d => {
      return d.missionId !== missionId
    });

    this.dataSubject.next(arr);
  }

}
