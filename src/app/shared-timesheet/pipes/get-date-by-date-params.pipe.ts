import { Pipe, PipeTransform } from '@angular/core';
import { DateParams } from '../../shared/interfaces/date-params.interface';
import { DateTimeService } from 'src/app/core/services';

@Pipe({
  name: 'getDateByDateParams'
})
export class GetDateByDateParamsPipe implements PipeTransform {
  constructor(private dateTimeService: DateTimeService){}

  transform(dateParams: DateParams, weekDayOverride: number): Date {
    let date = this.dateTimeService.getWeekRangeByDateParams(dateParams)[0];

    if(weekDayOverride || dateParams.weekDay)
      date.setDate(date.getDate() + (weekDayOverride - 1) || dateParams.weekDay);

    return date;
  }

}