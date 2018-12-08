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

  identifer: String;
  name: String;

  constructor(private eventService: EventService, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  send() {
    this.eventService.addEvent(this.identifer, this.name).then(() => {
      this.userService.getUser();
      this.router.navigate(["/", "event", this.identifer]);
    }).catch((err) => {
      if(err.response.status === 400 && err.response.data === "Identifier used") {
        $('#add-event-identifier').addClass('invalid');
        M.toast({html: "Die ID ist bereits genutzt"});
      }
    })
  }

}
