import Konva from "konva";
import { Rect as KRect } from "konva/lib/shapes/Rect";

/**
 * @deprecated
 */
export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  kshape: KRect | null;
  fill:string;

  constructor(
    x: number,
    y: number,
    width: number,
    height:number,
    fill:string,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill
  }

  make_rect() {
    this.kshape = new Konva.Rect({
      x: this.x,
      y: this.y,
      width:this.width,
      height: this.height,
      fill: this.fill,
      // stroke: 'black',
      // strokeWidth: 4
    })
  }
}