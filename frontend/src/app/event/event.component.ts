import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../event.service";
import {UserService} from "../user.service";

declare let $: any;
declare let M: any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {
  public eventFamilyStats;
  public eventIdentifier;
  public eventUserPerson;
  public eventUserDays;
  dataLoaded: Promise<boolean>;

  constructor(private activeRoute: ActivatedRoute, private eventService: EventService, private userService: UserService) {
  }

  changeEventUserData() {
    this.eventService.changeUserEventDetails(this.eventUserPerson, this.eventUserDays, this.eventIdentifier).then(() => {
      M.toast({html: 'Daten wurden geändert!'});
      this.eventService.getFamilyStats(this.eventIdentifier).then((familyStats) => {
        this.eventFamilyStats = familyStats;
        this.userService.forceGetUser();
      });
    }).catch((err) => {
      M.toast({html: 'Es gab einen Fehler!'})
    })
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.eventIdentifier = params.id;
      this.eventService.getFamilyStats(this.eventIdentifier).then((familyStats) => {
        this.eventFamilyStats = familyStats;
        this.dataLoaded = Promise.resolve(true);
        $(function () {
          $('.tabs').tabs();
        })
      }).catch((err) => {
        console.error(err);
      })
    })
  }
}
