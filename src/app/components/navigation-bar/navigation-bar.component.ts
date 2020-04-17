import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  @Input() user: string; 
  @Input() site: string; 
  @Output() menu:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public brand:string;

  public TERMINAL_CURSOR_STATE = false;

  constructor() {}

  ngOnInit() {
    if (!this.user) this.user = 'nobody';
    if (!this.site) this.site = 'example.com';

    this.brand = `${this.user}@${this.site} $`;
    const terminalCursorBlink = interval(500).subscribe(state => this.TERMINAL_CURSOR_STATE = this.TERMINAL_CURSOR_STATE ? false : true);
  }

  getMenuClick() {
    this.menu.emit(true);
  }

}
