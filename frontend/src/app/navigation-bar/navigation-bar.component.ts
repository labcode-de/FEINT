import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../user.service";
import {IsAuthenticated} from "../is-authenticated";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  public loggedIn: boolean = false;
  constructor(private isAuthenticated: IsAuthenticated) {
    this.isAuthenticated.isAuthenticated().then((result) => {
      if(result) {
        this.loggedIn = true;
      }
    })
  }


  ngOnInit() {}

}
