import { Layer } from "konva/lib/Layer";
import { make_layer } from "../XYChart";
import { area, coord, font, line } from "../Config";
import { Point } from "../Point";
import { Stage } from "konva/lib/Stage";
import { Polygon } from "../Line";

export class Envelope {

  _layer: Layer

  /**
   * jumlah point didalam array menunjukkan seberapa banyak envelope yang akan digambar,
   * bukan menunjukkan point/nextpoint sebuah shape
   */
  // _points:Array<Array<Point>>;
  _points: Array<Point>;

  constructor(coord: coord | Point, stage: Stage) {
    this._layer = make_layer('envelope', coord)
    this._points = [];
    stage.add(this._layer)
  }

  getPoly(index:number):Polygon|null{
    return this._points[index].line instanceof Polygon ? this._points[index].line : null
  }

  Add(points: Array<Point>):number {
    let i = 0;
    let point = points[i] as Point;
    while (point) {
      if (points[i + 1]) {
        point.nextPoint = points[i + 1];
      }
      i += 1;
      point = points[i];
    }
    // console.log(points[points.length-1].nextPoint)
    points[points.length - 1].nextPoint = points[0] // supaya looping/ nyambung dari point ke point
    this._points.push(points[0])
    return this._points.length - 1;
  }

  Draw(index: number, config: area) {
    let firstPoint = this._points[index];
    firstPoint.create_polygon(config)
    if ((firstPoint.line as Polygon).area) {
      this._layer.add((firstPoint.line as Polygon).area!.line)
      this._layer.add((firstPoint.line as Polygon).area!.poly)
    }
    // if (firstPoint.line && firstPoint.line.kline) {
    //   this._layer.add(firstPoint.line.kline)
    // }
  }

  Get(index: number) {
    return this._points[index];
  }

  AttachPoint(index: number) {
    let point = this._points[index];
    while (point.nextPoint) {
      if (point.dot?.kshape!) {
        this._layer.add(point.dot?.kshape!);
      }
      point = point.nextPoint;
      if (point === this._points[index]) {
        break;
      }
    }
  }

  AttachLabel(index:number, position:number, text:string, configFont:font, point1:number, point2:number, additionalCoord:coord = {x:0,y:0}){
    if(this.getPoly(index)){
      this.getPoly(index)!.create_label(position, text, configFont, point1,point2, additionalCoord);
      if(this.getPoly(index)!.label){
        this._layer.add(this.getPoly(index)!.label?.rect!)
        this._layer.add(this.getPoly(index)!.label?.text!)
      }
    }
  }
}