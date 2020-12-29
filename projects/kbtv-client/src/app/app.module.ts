import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import norwayLocale from '@angular/common/locales/nb';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeTopNavComponent } from './home/home-top-nav.component';
import { HomeComponent } from './home/home.component';
import { AppLayoutModule } from './layout/app-layout.module';
import { NotificationModule } from '@notification/notification.module';
import { AppHammerConfig } from './shared-app/app-hammer-config';
import { SharedAppModule } from './shared-app/shared-app.module';

registerLocaleData(norwayLocale, 'nb-NO');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeTopNavComponent,
  ],
  imports: [
    BrowserAnimationsModule,   
    HttpClientModule, 
    CoreModule, 
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    
    AppRoutingModule, 
    AppLayoutModule,
    SharedAppModule,
    NotificationModule
  ],
  providers:[ 
    { provide: LOCALE_ID, useValue: "nb-NO" }, 
    { provide: HAMMER_GESTURE_CONFIG, useClass: AppHammerConfig},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {  }