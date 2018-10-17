import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../user";
declare var $: any;
declare var M: any;
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  public user: User;

  firstName: String;
  familyName: String;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.firstName = this.user.firstName;
    this.familyName = this.user.familyName;
    $('#control-firstName').val(this.user.firstName);
    $('#control-familyName').val(this.user.familyName);
    $('#control-email').val(this.user.email);
    M.updateTextFields();
  }
  submit() {
    this.userService.changeUserProfile(this.firstName, this.familyName);
  }

}
