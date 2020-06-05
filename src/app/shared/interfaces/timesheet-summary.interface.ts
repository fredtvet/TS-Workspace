import { Timesheet } from './models/timesheet.interface';

export interface TimesheetSummary{   
    timesheets: Timesheet[];
    openHours: number;
    confirmedHours: number;
    userName?: string;
    fullName?: string;
    year?: number;
    month?: number;
    week?: number;
    day?: string;
}