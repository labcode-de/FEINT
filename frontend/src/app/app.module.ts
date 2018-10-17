import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from "@angular/router";
import {routes} from "./routes";
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import {Form, FormsModule} from "@angular/forms";
import {UserService} from "./user.service";
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {IsAuthenticated} from "./is-authenticated";
import { HomeComponent } from './home/home.component';
import { ControlComponent } from './control/control.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationBarComponent,
    HomeComponent,
    ControlComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [UserService, IsAuthenticated],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
