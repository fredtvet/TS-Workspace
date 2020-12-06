import { MissionCriteria } from 'src/app/shared/interfaces';
import { StateMissions, StateEmployers, StateMissionTypes, StateMissionImages, StateMissionDocuments, StateMissionNotes, StateCurrentUser } from 'src/app/state/interfaces';

export interface StoreState extends
    StateMissions, 
    StateEmployers,
    StateMissionTypes,
    StateMissionImages,
    StateMissionDocuments,
    StateMissionNotes,
    StateCurrentUser {} 

export interface ComponentStoreState { 
    missionCriteria: MissionCriteria; 
}