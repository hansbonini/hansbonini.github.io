import { Component } from "@angular/core";
import {
  trigger,
  transition,
  useAnimation,
  state,
  style
} from "@angular/animations";
import { slideInUp, slideOutUp } from "ng-animate";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("openClosed", [
      state('closed', style({'display': 'none'})),
      transition("open => closed", useAnimation(slideOutUp)),
      transition("closed => open", [style({'display': 'block' }), useAnimation(slideInUp)])
    ]), 
  ]
})
export class AppComponent {
  name = "Meu Site";

  MENU_STATE = false;

  toggleMenu(clicked: boolean) {
    this.MENU_STATE = this.MENU_STATE ? false : true;
    console.log(this.MENU_STATE);
  }
}
