import { Timesheet } from 'src/app/shared/interfaces/models';
import { TimesheetStatus } from 'src/app/shared/enums';
import { NotificationService } from '../../ui/notification.service';
import { ApiService } from '../../api.service';
import { UserTimesheetSubject } from './user-timesheet.subject';
import { DeviceInfoService } from '../../device-info.service';
import { Injectable } from '@angular/core';
import { Observable, throwError, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DateParams, TimesheetSummary } from 'src/app/shared/interfaces';
import { BaseMissionChildService } from '../abstracts/base-mission-child.service';
import { MissionSubject } from '../mission/mission.subject';

@Injectable({
  providedIn: 'root'
})

export class UserTimesheetService extends BaseMissionChildService<Timesheet> {

  constructor(
    notificationService: NotificationService,
    apiService: ApiService,
    deviceInfoService: DeviceInfoService,
    private missionSubject: MissionSubject,
    protected dataSubject: UserTimesheetSubject
  ){
    super(notificationService, apiService, dataSubject, deviceInfoService, "/UserTimesheets");
  }

  getByWeekGrouped$(dateParams: DateParams): Observable<Timesheet[][]>{
    return this.dataSubject.getByWeekGrouped$(dateParams);
  }

  getByWeekRangeGrouped$(startWeek: number, endWeek: number, year: number, excludeStatus?: TimesheetStatus): Observable<TimesheetSummary[]>{
    return this.dataSubject.getByWeekRangeGrouped$(startWeek, endWeek, year,  excludeStatus);
  }

  getByWithMission$(expression: (value: Timesheet, index?: number, Array?: any[]) => boolean): Observable<Timesheet[]>{
    return combineLatest(super.getBy$(expression), this.missionSubject.getAll$()).pipe(map(([timesheets, missions]) =>{
      const missions_obj = {}; //Create associative list for faster index search
      missions.forEach(x => missions_obj[x.id] = x); 
      timesheets.forEach(t => t.mission = missions_obj[t.missionId]);
      return timesheets;
    }))
  }

  getWithMission$(id: number): Observable<Timesheet>{
    return this.dataSubject.get$(id).pipe(switchMap(entity => {
      if(entity === undefined) return throwError('Entity not found');
      return this.missionSubject.get$(entity.missionId).pipe(map(x => {
        let e = {...entity};
        e.mission = x;
        return e;
      }))
    })); 
  }

  getCount$(status: TimesheetStatus = undefined): Observable<number>{
    return this.dataSubject.getCount$(status);
  }

  deleteRange$(){return undefined}


  
}
