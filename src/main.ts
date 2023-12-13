import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppLogin } from './app/app.component';

//Carga la info
bootstrapApplication(AppLogin, appConfig)
  .catch((err) => console.error(err));
