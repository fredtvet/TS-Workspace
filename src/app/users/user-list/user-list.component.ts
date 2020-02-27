import { Component, OnInit } from '@angular/core';
import { UsersService, IdentityService } from 'src/app/core';
import { User, ROLES } from 'src/app/shared';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { SubscriptionComponent } from 'src/app/subscription.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends SubscriptionComponent {
  ROLES = ROLES;

  users: User[];
  currentUser: User;

  constructor(
    private usersService: UsersService,
    private identityService: IdentityService,
    private router: Router) { super() }

  ngOnInit() {
    combineLatest( //Calling seperate to have them ordered correctly. Should be done more efficiently.
      this.usersService.getByRole$(ROLES.Leder),
      this.usersService.getByRole$(ROLES.Mellomleder),
      this.usersService.getByRole$(ROLES.Ansatt),
      this.usersService.getByRole$(ROLES.Oppdragsgiver),
    )
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(([group1, group2, group3, group4]) => {this.users = [...group1, ...group2, ...group3, ...group4]});

    this.identityService.currentUser$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => this.currentUser = data);
  }

  editUser(userName: string){
    this.router.navigate(['brukere', userName, 'rediger'])
  }

  createUser(){
    this.router.navigate(['brukere', 'ny'])
  }

}
