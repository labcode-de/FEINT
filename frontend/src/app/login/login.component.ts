import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {IsAuthenticated} from "../is-authenticated";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public apiServer: string = environment.apiServer;
  constructor(private isAuthenticated: IsAuthenticated, private router: Router) { }

  ngOnInit() {
    this.isAuthenticated.isAuthenticated().then(() => {
      this.router.navigate(['/']);
    })
  }


}
