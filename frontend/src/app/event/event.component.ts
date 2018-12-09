import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../event.service";
declare let $: any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {
  public eventFamilyStats;
  public eventIdentifier;
  dataLoaded: Promise<boolean>;
  constructor(private activeRoute: ActivatedRoute, private eventService: EventService) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.eventIdentifier = params.id;
      this.eventService.getFamilyStats(params.id).then((familyStats) => {
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
