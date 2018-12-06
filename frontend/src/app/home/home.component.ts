import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public user;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.user;
    console.log(this.user);
  }

}
