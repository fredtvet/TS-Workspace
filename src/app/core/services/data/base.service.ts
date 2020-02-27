import { BaseEntity } from 'src/app/shared/models';
import { Observable, throwError } from 'rxjs';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { BaseSubject } from '../../subjects/base.subject';
import { ApiService } from '../api.service';
import { ConnectionService } from '../connection.service';
import { NotificationService } from '../notification.service';
import { NOTIFICATIONS } from 'src/app/shared/notifications.enum';

export abstract class BaseService<T extends BaseEntity>{

  protected isOnline: boolean = false;

  constructor(
    protected notificationService: NotificationService,
    protected apiService: ApiService,
    protected dataSubject: BaseSubject<T>,
    protected connectionService: ConnectionService,
    protected readonly uri:string
    ) {
      this.connectionService.isOnline$.subscribe(res =>this.isOnline = res)
    }

  dbSync(): void{
    if(!this.isOnline) return null;
    let fromDate = this.dataSubject.getTimestamp();

    this.apiService
      .post(`${this.uri}/Sync`,{ FromDate: fromDate })
      .pipe(
        retry(3),
        tap(this.dataSubject.sync),
        catchError(err => {
        this.notificationService.setNotification('Noe gikk feil med synkroniseringen!' , NOTIFICATIONS.Error)
        throw err;})
      )
  }

  getAll$(): Observable<T[]> {
    return this.dataSubject.getAll$();
  }

  get$(id: number):Observable<T>{
    return this.dataSubject.get$(id);
  }

  add$(entity: T): Observable<T>{

    if(!this.isOnline) return throwError('Du må være tilkoblet internett for å legge til ting.')
      .pipe(tap(next => {}, error => this.notificationService.setNotification(error, NOTIFICATIONS.Error)));

    return this.apiService
                .post(`${this.uri}`, entity)
                .pipe(map(data =>{
                  console.log(data);
                  this.dataSubject.addOrReplace(data);
                  return data;
                }));
  }

  update$(entity: T): Observable<T>{

    if(!this.isOnline)
      return throwError('Du må være tilkoblet internett for å oppdatere ting.')
              .pipe(tap(next => {}, error => this.notificationService.setNotification(error, NOTIFICATIONS.Error)));
    console.log(entity);
    return this.apiService.put(`${this.uri}/${entity.id}`, entity)
      .pipe(map(data => {
        console.log(data);
        this.dataSubject.update(data);
        return data;
      }));
  }

  delete$(id: number): Observable<boolean> {

    if(!this.isOnline)
      return throwError('Du må være tilkoblet internett for å slette ting.')
              .pipe(tap(next => {}, error => this.notificationService.setNotification(error, NOTIFICATIONS.Error)));

    return this
            .apiService
            .delete(`${this.uri}/${id}`)
            .pipe(tap(bool =>{
              if(bool) this.dataSubject.delete(id);
            }));
  }

  deleteRange$(ids: number[]): Observable<boolean>{
    if(!this.isOnline)
    return throwError('Du må være tilkoblet internett for å slette ting.')
            .pipe(tap(next => {}, error => this.notificationService.setNotification(error, NOTIFICATIONS.Error)));

    return this
            .apiService
            .post(`${this.uri}/DeleteRange`, {Ids: ids})
            .pipe(tap(bool =>{
              if(bool) this.dataSubject.deleteRange(ids);
            }));
  }

  refreshLocal(): void{
    this.dataSubject.purge();
    this.dbSync();
  }

}
