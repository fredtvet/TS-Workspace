import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { IdentityService, LoadingService, ConnectionService, UserTimesheetService, MainNavService } from 'src/app/core/services';
import { Roles } from '../../enums/roles.enum';
import { MatDrawer, MatBottomSheet } from '@angular/material';
import { User } from '../../models/user.model';
import { SubscriptionComponent } from 'src/app/shared/components/abstracts/subscription.component';
import { TimesheetStatus } from '../../enums/timesheet-status.enum';
import { BottomSheetMenuComponent } from '../../components/bottom-sheet-menu/bottom-sheet-menu.component';
import { MainNavConfig } from '../../interfaces/main-nav-config.interface';
import { AppButton } from '../../interfaces/app-button.interface';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent extends SubscriptionComponent {
  Roles = Roles;

  @ViewChild('drawer', {static: true}) drawer:MatDrawer;
 
  config$: Observable<MainNavConfig> = this.mainNavService.config$;

  currentUser$:  Observable<User> = this.identityService.currentUser$;
  conSub$:  Observable<boolean> = this.connectionService.isOnline$;
  loading$: Observable<boolean> = this.loadingService.loading$;

  private isXs$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      takeUntil(this.unsubscribe),
      map(result => result.matches),
      shareReplay()
    );

  isXs: boolean;

  searchBarHidden = true;

  constructor(
    private mainNavService: MainNavService,
    private breakpointObserver: BreakpointObserver,
    private identityService: IdentityService,
    private router: Router,
    private connectionService: ConnectionService,
    private loadingService: LoadingService,
    private _bottomSheet: MatBottomSheet) { super(); }

  ngOnInit(){
    this.isXs$.pipe(takeUntil(this.unsubscribe)).subscribe(xs => this.isXs = xs)
  }

  toggleDrawer(){
    if(this.isXs) this.drawer.toggle()
  }

  toggleSearchBar(){
    this.searchBarHidden = !this.searchBarHidden;
  }

  handleLogout(){
    this.identityService.purgeAuth();
    this.router.navigate(['/login']);
  } 
  
  openBottomSheet = (buttons: AppButton[]) => this._bottomSheet.open(BottomSheetMenuComponent, { data: buttons });

  handleFn = (fn: Function, parameters: any[] = []) => fn(...parameters);

}
