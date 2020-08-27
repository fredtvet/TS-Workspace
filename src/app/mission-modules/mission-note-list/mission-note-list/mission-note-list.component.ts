import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MissionNote } from 'src/app/core/models';
import { MainNavService } from 'src/app/core/services';
import { RolePresets } from 'src/app/shared-app/enums';
import { TopDefaultNavConfig } from 'src/app/shared-app/interfaces';
import { MissionNoteListStore } from '../mission-note-list.store';

@Component({
  selector: 'app-mission-note-list',
  templateUrl: './mission-note-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionNoteListComponent {
  
  notes$: Observable<MissionNote[]> = this.store.getByMissionId$(this.missionId);
  
  constructor( 
    private store: MissionNoteListStore,
    private mainNavService: MainNavService,
    private route: ActivatedRoute,
    private router: Router,
    ) {  this.configureMainNav(this.missionId); }

  get missionId() {
    return +this.route.snapshot.paramMap.get('id');
  }

  openEditNoteForm = (entityId: number) => 
    this.router.navigate(['skjema', {config: JSON.stringify({entityId, missionId: this.missionId})}], {relativeTo: this.route});

  private openCreateNoteForm = () => 
    this.router.navigate(['skjema', {config: JSON.stringify({missionId: this.missionId})}], {relativeTo: this.route});

  private configureMainNav(missionId: number){
    let cfg = {
      title:  "Notater",
      backFn: this.onBack, 
      backFnParams: [missionId]
    } as TopDefaultNavConfig;
    let fabs = [
      {icon: "add", aria: 'Legg til', colorClass: 'bg-accent', callback: this.openCreateNoteForm, allowedRoles: RolePresets.Internal}
    ];
    this.mainNavService.addConfig({default: cfg}, fabs);
  }

  private onBack = (missionId: number) => this.router.navigate(['/oppdrag', missionId, 'detaljer']);
}
