import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {IsAuthenticated} from "./is-authenticated";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [IsAuthenticated]
  },
  { path: 'login',
    component: LoginComponent
  },
];
