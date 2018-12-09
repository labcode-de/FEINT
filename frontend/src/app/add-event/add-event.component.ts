import { Component, OnInit } from '@angular/core';
import {EventService} from "../event.service";
import {Router} from "@angular/router";
import {UserService} from "../user.service";
declare let $: any;
declare let M: any;

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  create_identifier: String;
  create_name: String;
  token_inviteCode: String;

  constructor(private eventService: EventService, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  token_send() {
    this.eventService.addTokenEvent(this.token_inviteCode).then(() => {
      this.userService.getUser();
      this.router.navigate(["/", "event", this.token_inviteCode.split("_")[0]]);
    }).catch((err) => {
      if(err.response.status === 400 && err.response.data === "Token incorrect") {
        $('#token-event-token').addClass('invalid');
        M.toast({html: "Der Token ist falsch"});
      }
    })
  }

  create_send() {
    this.eventService.createEvent(this.create_identifier, this.create_name).then(() => {
      this.userService.getUser();
      this.router.navigate(["/", "event", this.create_identifier]);
    }).catch((err) => {
      if(err.response.status === 400 && err.response.data === "Identifier used") {
        $('#create-event-identifier').addClass('invalid');
        M.toast({html: "Die ID ist bereits genutzt"});
      }
    })
  }

}
