import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, useAnimation } from '@angular/animations';
import { flip } from 'ng-animate';
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
  animations: [
    trigger('flip', [transition('* => *', useAnimation(flip))]),
  ],
})
export class PostListComponent implements OnInit {
  @Input() category:string;
  public flip: any;
  public posts: any = [];

  constructor(private server: DataService ) {
  }

  ngOnInit() {
    if (this.category) {
      this.server.getCategory(this.category).subscribe(
        response => response.posts.map(
          post => {
            post.url = post.url.replace('/api/post/','');
            this.posts.push(post)
          }
        )
      );
    }
  }
}
