import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public categories:any = [];

  @Output() toggle:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private server: DataService) {
    this.server.getCategories().subscribe(
      response => response.map(
        post => this.categories.push(post)
      )
    );
  }

  ngOnInit() {
  }

  menuToggle() {
    this.toggle.emit(true);
  }

}
