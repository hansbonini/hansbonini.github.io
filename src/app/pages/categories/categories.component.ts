import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"]
})
export class CategoriesComponent implements OnInit {
  public slug:string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.slug = this.route.snapshot.paramMap.get("slug").toString();
  }

  ngOnInit() {}
}
