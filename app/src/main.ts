import { bootstrapApplication } from '@angular/platform-browser';
import { appСonfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appСonfig)
  .catch((err) => console.error(err));
