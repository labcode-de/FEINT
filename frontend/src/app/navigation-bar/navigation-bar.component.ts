import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  loggedIn = false;
  constructor(private router: Router) {
    // this.hideElement = !router.urlTree.contains(router.createUrlTree(['/login']))
  }

  ngOnInit() {
    this.loggedIn = false;
  }

}
