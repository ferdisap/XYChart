import Konva from "konva";
import { Line as KLine } from "konva/lib/shapes/Line";
import { Circle as KCircle } from "konva/lib/shapes/Circle";
import type { KonvaEventListener } from "konva/lib/Node";

export class Circle {
  x: number;
  y: number;
  radius: number;
  kshape: KCircle | null;
  fill:string;

  constructor(
    x: number,
    y: number,
    radius: number,
    fill:string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill
  }

  /**
   * 
   * @param onClick returning param context and eventType (mouse event or pointer event)
   */
  make_circle(onClick:Function|null) {
    this.kshape = new Konva.Circle({
      x: this.x,
      y: this.y,
      radius: this.radius,
      fill: this.fill,
      // stroke: 'black',
      // strokeWidth: 4
    })

    if(onClick){
      this.kshape.on('click', function (e) {
        return onClick(this, e)
      });
      // this.kshape.on('click', (ev) => onClick(ev));
      // this.kshape.on('click', onClick as KonvaEventListener as Event);
      // this.kshape.on('click', onClick);
    }
  }
}