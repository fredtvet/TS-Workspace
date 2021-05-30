import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule).catch(err => console.error(err));
// .then(module => {
//   let applicationRef = module.injector.get(ApplicationRef);
//   let appComponent = applicationRef.components[0];
//   enableDebugTools(appComponent);
// })
  