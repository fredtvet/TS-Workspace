import { Mission } from '../mission.interface';
import { Model } from '../base-entity.interface';
import { Maybe } from '@global/interfaces';

export interface MissionChild extends Model{
  missionId?: string;
  mission?: Maybe<Mission>;
}
