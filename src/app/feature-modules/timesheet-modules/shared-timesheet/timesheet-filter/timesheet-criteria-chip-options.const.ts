import { User, Mission } from '@core/models';
import { CriteriaChipOptions } from '@core/services/ui/chips-factory.service';
import { _getModelDisplayValue } from '@model/helpers/get-model-property.helper';
import { _formatDateRange } from '@datetime/format-date-range.helper';
import { _formatShortDate } from '@datetime/format-short-date.helper';
import { TimesheetStatus } from '@shared/enums';
import { translations } from '@shared/translations';
import { TimesheetCriteria } from './timesheet-criteria.interface';
import { DateRange } from '@datetime/interfaces';

export const TimesheetCriteriaChipOptions: {[key in keyof TimesheetCriteria]: CriteriaChipOptions} = {
    user: {valueFormatter: (val: User) => val.lastName + ', ' + val.lastName}, 
    mission: {valueFormatter: (val: Mission) => _getModelDisplayValue("missions", val)},
    dateRange: {valueFormatter: (val: DateRange) => _formatDateRange(val, _formatShortDate)}, 
    dateRangePreset: {ignored: true},
    status: {valueFormatter: (val: TimesheetStatus) => translations[TimesheetStatus[val]?.toLowerCase()]}, 
}