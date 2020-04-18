import { Component, HostListener, ElementRef, ViewChild } from "@angular/core";
import {
  trigger,
  transition,
  useAnimation,
  state,
  style
} from "@angular/animations";
import { fadeIn, fadeOut, slideInUp, slideOutUp } from "ng-animate";

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
    trigger("scrollDisplay", [
        state('hide', style({'display': 'none'})),
        transition("hide => show",[style({'display': 'block' }), useAnimation(fadeIn)]),
        transition("show => hide",[style({'display': 'none' }), useAnimation(fadeOut)])
    ])
  ]
})
export class AppComponent {
  name = "Meu Site";

  MENU_STATE = false;
  SCROLL_STATE = false;
  MOBILE_STATE = false;

  private screenHeight: number = 0;
  private screenWidth: number = 0;
  public scrollOffset: number = 0;
  public scrollerOffset: number = 0;
  public scrollerHeight: number = 0;
  public scrollerAmount: number = 0;
  public lastMouseScrollOffset: number = 0;
  
  @ViewChild('page') page: ElementRef;
  
  @HostListener("window:resize", ["$event"]) responsiveCanvas(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.MOBILE_STATE = false;
    if (this.screenWidth > 768) {
        this.MOBILE_STATE = true;
    }
  }
  
  ngOnInit() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.MOBILE_STATE = false;
    if (this.screenWidth > 768) {
        this.MOBILE_STATE = true;
    }
  }
  
  onActivate(event) {
    if (this.screenWidth > 768) {
        this.SCROLL_STATE = false;
        this.scrollOffset = 0;
        this.scrollerOffset = 10;
        this.scrollerHeight = 0;
        this.scrollerAmount = 0;
        setTimeout(t => {
            if (this.page.nativeElement.offsetHeight > this.screenHeight) {
                this.SCROLL_STATE = true;
                this.scrollerAmount = (this.page.nativeElement.offsetHeight*0.05);
                this.scrollerHeight = ((this.screenHeight-100)*0.05)
                return;
            }
            this.SCROLL_STATE = false;
        }, 1000);
    }
  }
 
  scrollUp() {
    if (this.scrollOffset > 10) {
        this.scrollOffset -= this.scrollerAmount;
        this.scrollerOffset -= this.scrollerHeight;
    }
  }
 
  scrollDown() {
    if (this.scrollOffset < this.page.nativeElement.offsetHeight-this.screenHeight) { 
        this.scrollOffset += this.scrollerAmount;
        this.scrollerOffset += this.scrollerHeight;
    }
  }
  
  isWheelUp (event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
  }
  
  mouseScroll(event) {
     if (!this.isWheelUp(event)) {
        this.scrollDown()
        return;
     }
     this.scrollUp()
  }
  
  toggleMenu(clicked: boolean) {
    this.MENU_STATE = this.MENU_STATE ? false : true;
  }
}
