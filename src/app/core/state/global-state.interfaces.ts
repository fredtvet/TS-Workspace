import { Mission, Employer, MissionType, MissionImage, MissionDocument, MissionNote, AppDocumentType, Timesheet, User } from '@core/models';

export interface StateMissions { missions: Mission[] }  
export interface StateEmployers { employers: Employer[] }
export interface StateMissionTypes { missionTypes: MissionType[] }
export interface StateMissionImages { missionImages: MissionImage[] }
export interface StateMissionDocuments { missionDocuments: MissionDocument[] }
export interface StateMissionNotes { missionNotes: MissionNote[] }
export interface StateDocumentTypes { documentTypes: AppDocumentType[] }
export interface StateUserTimesheets { userTimesheets: Timesheet[] }
export interface StateCurrentUser { currentUser: User }
export interface StateUsers { users: User[] }
export interface StateInboundEmailPassword { inboundEmailPasswords: User[] }
export interface StateTimesheets { timesheets: Timesheet[] }