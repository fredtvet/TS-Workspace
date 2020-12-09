import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { StateModule } from '@state/state.module';
import { AppButtonComponent, ListCardComponent, NavItemComponent } from './components';
import { ListItemComponent } from './components/list-item/list-item.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
import { IfRoleDirective, InputListenerDirective } from './directives';
import { ReverseArrayPipe, TransformButtonsPipe } from './pipes';

@NgModule({
  declarations: [
    PageNotFoundComponent,  
    AppButtonComponent,  
    NavItemComponent,
    ListCardComponent,
    ListItemComponent,
    ReverseArrayPipe,
    TransformButtonsPipe,

    IfRoleDirective,
    InputListenerDirective,
  ],
  imports: [
    RouterModule,
    CommonModule, 
    FlexLayoutModule,

    StateModule,
    
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatRippleModule,
    MatCardModule,

    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    RouterModule,
    CommonModule, 
    FlexLayoutModule,
    
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatRippleModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,  
    MatCardModule,

    PageNotFoundComponent,
    AppButtonComponent,  
    NavItemComponent,   
    ListCardComponent,
    ListItemComponent,
    
    ReverseArrayPipe,
    TransformButtonsPipe,

    IfRoleDirective,
    InputListenerDirective,
  ]
})
export class SharedAppModule {}
