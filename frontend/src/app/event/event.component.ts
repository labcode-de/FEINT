import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../event.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public eventFamilyStats;
  dataLoaded: Promise<boolean>;

  constructor(private activeRoute: ActivatedRoute, private eventService: EventService) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.eventService.getFamilyStats(params.id).then((familyStats) => {
        this.eventFamilyStats = familyStats;
        console.log(familyStats);
        this.dataLoaded = Promise.resolve(true)
      }).catch((err) => {
        console.error(err);
      })
    })
  }
}
