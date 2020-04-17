import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener
} from "@angular/core";
import { interval, range, from } from "rxjs";
import { map, takeWhile, skipWhile } from "rxjs/operators";
import { Observer, Observable } from "rxjs";

@Component({
  selector: "app-background-canvas",
  templateUrl: "./background-canvas.component.html",
  styleUrls: ["./background-canvas.component.scss"]
})
export class BackgroundCanvasComponent implements AfterViewInit {
  private canvasEl: HTMLCanvasElement;
  private canvasCx: CanvasRenderingContext2D;
  private screenHeight: number;
  private screenWidth: number;
  private lines: any = [];

  @HostListener("window:resize", ["$event"]) responsiveCanvas(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.resizeCanvas();
    this.fillCanvasBackground();
  }

  @ViewChild("canvas")
  public canvas: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    this.getCanvas();
    this.responsiveCanvas();
    const fpsCounter = interval(100);
    fpsCounter.subscribe(n => this.makeItRain());
  }

  getCanvas() {
    this.canvasEl = this.canvas.nativeElement;
    this.canvasCx = this.canvasEl.getContext("2d");
  }

  resizeCanvas() {
    this.canvasEl.width = this.screenWidth;
    this.canvasEl.height = this.screenHeight;
  }

  fillCanvasBackground() {
    this.canvasCx.beginPath();
    this.canvasCx.rect(0, 0, this.screenWidth, this.screenHeight);
    this.canvasCx.fillStyle = "#212121";
    this.canvasCx.fill();
  }

  makeItRain() {
    this.createLine();
    this.clearCanvas();
    this.drawLines();
  }

  clearCanvas() {
    this.canvasCx.clearRect(0, 0, this.screenWidth, this.screenHeight);
  }

  createLine() {
    const line = new Observable(observer =>
      observer.next(Math.floor(Math.random() * 2))
    )
      .pipe(
        takeWhile(l => l === 0 && this.lines.length < Math.floor(this.screenWidth * 0.15))
      )
      .subscribe(n => {
        const text = new RandomTextCanvas(this.screenHeight);
        this.lines.push(new TextLineCanvas(text.canvasEl, this.canvasEl, 10));
      });
  }

  drawLines() {
    const draw = from(this.lines)
      .pipe(
        map((line: TextLineCanvas) =>
          this.canvasCx.drawImage(
            line.text,
            line.offsetX,
            line.animate(),
            20,
            this.screenHeight
          )
        )
      )
      .subscribe();
  }
}

class RandomTextCanvas {
  public canvasEl: HTMLCanvasElement;
  private canvasCx: CanvasRenderingContext2D;
  private fontFace: string = "'VT323'";
  private primaryColor: string = "#263238";
  private secondaryColor: string = "#607d8b";
  private shadowOffsetX: number = 2;
  private shadowOffsetY: number = -5;
  private shadowBlur: number = 1;
  private spacing: number = 30;

  constructor(maxHeight: number) {
    const variantWidth = Math.floor(Math.random() * 40) + 1; // Variant Width maximum size 40px
    this.canvasEl = document.createElement("canvas");
    this.canvasCx = this.canvasEl.getContext("2d");
    this.canvasEl.width = this.spacing + variantWidth;
    this.canvasEl.height = maxHeight;
    this.canvasEl.style.display = "none";

    this.canvasCx.font = `${variantWidth}px ${this.fontFace}`;
    this.canvasCx.textAlign = "center";
    this.canvasCx.shadowColor = this.primaryColor;
    this.canvasCx.shadowOffsetX = this.shadowOffsetX;
    this.canvasCx.shadowOffsetY = this.shadowOffsetY;
    this.canvasCx.shadowBlur = this.shadowBlur;
    this.canvasCx.fillStyle = this.generateColor(
      this.secondaryColor,
      variantWidth
    );
    this.canvasCx.textAlign = "left";

    this.fillRandomText();
  }

  fillRandomText() {
    const text = range(1, 100).subscribe(n => {
      const source = new Observable(observer =>
        observer.next(Math.floor(Math.random() * 100))
      )
        .pipe(skipWhile(c => c < 60))
        .subscribe((charCode:number) =>
          this.canvasCx.fillText(String.fromCharCode(charCode), 0, n * 10)
        );
    });
  }

  generateColor(hex: string, variation: number) {
    let num = parseInt(hex.slice(1, 7), 16);
    let amt = Math.round(2.55 * variation);
    let R = (num >> 16) - amt;
    let B = ((num >> 8) & 0x00ff) - amt;
    let G = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}

class TextLineCanvas {
  public text: HTMLCanvasElement;
  public offsetY: number;
  public offsetX: number;
  private step: number;
  private initialY: number;
  private maxY: number;

  constructor(
    text: HTMLCanvasElement,
    canvas: HTMLCanvasElement,
    speed: number
  ) {
    this.text = text;
    this.offsetX = Math.floor(Math.random() * canvas.width);
    this.offsetY = canvas.height * -1;
    this.initialY = canvas.height * -1;
    this.maxY = canvas.height;
    this.step = speed;
  }

  animate() {
    if (this.offsetY >= this.maxY) {
      this.offsetY = this.initialY;
    }
    this.offsetY += this.step;
    return this.offsetY;
  }
}
