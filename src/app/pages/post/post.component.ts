import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
  public html: string = "";
  public title: string;
  public description: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private server: DataService
  ) {
    let slug = this.route.snapshot.paramMap.get("slug");
    this.server.getPost(slug).subscribe(response => {
      this.title = response.title;
      this.description = response.description;
      this.html = response.html;
    });
  }d
  
  close() {
    this.router.navigate(['/']);
  }
  
  ngOnInit() {}
  
}
