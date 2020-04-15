import { Component } from '@angular/core';
import { IdentityService, NotificationService, MainNavService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';
import { takeUntil, take } from 'rxjs/operators';
import { SubscriptionComponent } from 'src/app/shared/components/abstracts/subscription.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends SubscriptionComponent {

  user: User;
  passwordStatus: string;

  constructor(
    private mainNavService: MainNavService,
    private identityService: IdentityService,
    private notificationService: NotificationService,
  ){ 
    super();     
    this.configureMainNav();
  }

  ngOnInit() {
    this.identityService.currentUser$.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => this.user = user); 
  }

  updateProfile(updatedUser){
    updatedUser.userName = this.user.userName;

    this.identityService.updateCurrentUser(updatedUser).pipe(take(1))
      .subscribe(data => this.notificationService.setNotification('Vellykket oppdatering!'));
  }

  updatePassword(data: any){
    this.identityService.changePassword(data.oldPassword, data.password).pipe(take(1))
    .subscribe(
      data => this.notificationService.setNotification('Passord oppdatert!'),
      error => this.passwordStatus = "Nåværende passord stemmer ikke",
      () => this.passwordStatus = ""
    );
  }

  confirmPurge(){
    if(confirm('All data blir lastet inn på nytt neste gang du logger inn. Vær oppmerksom på at dette kan kreve mye mobildata om du ikke har Wi-Fi aktivert!')){
      window.localStorage.clear();
      location.reload();
    }
  }

  private configureMainNav(){
    let cfg = this.mainNavService.getDefaultConfig();
    cfg.title = "Profil";
    cfg.elevationEnabled = false;
    this.mainNavService.addConfig(cfg);
  }
}
