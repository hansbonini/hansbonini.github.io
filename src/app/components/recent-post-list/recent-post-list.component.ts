import { Component, OnInit } from "@angular/core";
import { trigger, transition, useAnimation } from '@angular/animations';
import { flip } from 'ng-animate';
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-recent-post-list",
  templateUrl: "./recent-post-list.component.html",
  styleUrls: ["./recent-post-list.component.scss"],
  animations: [
    trigger('flip', [transition('* => *', useAnimation(flip))]),
  ],
})
export class RecentPostListComponent implements OnInit {
  public flip: any;
  public posts: any = [];

  constructor(private server: DataService) {
    this.server.getRecentPosts().subscribe(
      response => response.map(
        post => {
          post.url = post.url.replace('/api/post/','');
          this.posts.push(post)
        }
      )
    );
  }

  ngOnInit() {
  }
}
