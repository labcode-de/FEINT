import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {IsAuthenticated} from "./is-authenticated";
import {HomeComponent} from "./home/home.component";
import {ControlComponent} from "./control/control.component";
import {EventComponent} from "./event/event.component";
import {AddEventComponent} from "./add-event/add-event.component";

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
  {
    path: 'control',
    component: ControlComponent,
    canActivate: [IsAuthenticated]
  },
  {
    path: 'event/:id',
    component: EventComponent,
    canActivate: [IsAuthenticated]
  },
  {
    path: 'addEvent',
    component: AddEventComponent,
    canActivate: [IsAuthenticated]
  }
];
