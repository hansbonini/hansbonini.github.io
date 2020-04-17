import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse } from 'ng-animate';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('pulse', [transition('* => *', useAnimation(pulse))])
  ]
})
export class AboutComponent implements OnInit {

  public posts:number = 0;
  public pulse;

  constructor(private server: DataService) {
    this.server.getRecentPosts().subscribe(
      response => { this.posts = response.length }
    );
  }

  ngOnInit() {
  }

}
