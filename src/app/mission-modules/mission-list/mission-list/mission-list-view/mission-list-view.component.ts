import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mission } from 'src/app/core/models';
import { _trackByModel } from 'src/app/shared-app/helpers/trackby/track-by-model.helper';

@Component({
  selector: 'app-mission-list-view',
  templateUrl: './mission-list-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionListViewComponent {

  @Input() missions: Mission[];

  constructor() { }

  trackByFn = _trackByModel("missions");
}
