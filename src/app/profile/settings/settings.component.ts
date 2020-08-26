import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MainNavService } from 'src/app/core/services';
import { SyncStore, SyncStoreConfig } from 'src/app/core/services/sync';
import { TopDefaultNavConfig } from 'src/app/shared-app/interfaces';
import { ConfirmDialogComponent, ConfirmDialogConfig } from 'src/app/shared/components';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  syncConfig$ = this.syncStore.syncConfig$;

  constructor(
    private router: Router,
    private mainNavService: MainNavService,
    private dialog: MatDialog,
    private syncStore: SyncStore
  ) { this.configureMainNav(); }

  confirmPurge = () => {
    let config: ConfirmDialogConfig = {title: 'Slett lokalt data?', message: 'All data vil bli lastet ned på nytt. Vær varsom ved bruk av mobildata.', confirmText: 'Slett'};
    //let confirmString = 'Bekreft at du ønsker å slette lokal data. Alt vil bli lastet inn på nytt og dette krever mye data.'
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent,{data: config});
    deleteDialogRef.afterClosed().pipe(filter(res => res)).subscribe(res => this.reloadAllData());
  }

  refresh = () => this.syncStore.syncAll();

  updateSyncConfig = (syncConfig: SyncStoreConfig) => {
    let cfg = {...syncConfig};
    cfg.refreshTime = cfg.refreshTime * 60;
    this.syncStore.updateSyncConfig(cfg);
  }

  private reloadAllData(){
    this.syncStore.purgeAll();
    this.syncStore.syncAll();
  }  

  private configureMainNav(){
    let cfg = {
      title:  "Innstillinger",
      backFn: this.onBack,
      elevationDisabled: false
    } as TopDefaultNavConfig;
    
    this.mainNavService.addConfig({default: cfg});
  }

  private onBack = () => this.router.navigate(['profil']);
}
