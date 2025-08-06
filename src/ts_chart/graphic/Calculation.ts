import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { coord, line } from "../Config";
import { make_layer } from "../XYChart";
import { Point } from "../Point";

export class Calculation {

  /**
   * isinya point2 yang mengartikan berapa jumlah calculator yang akan dibuat. MEW, BEW, dst ada di nextPoint
   */
  _weights: Array<Point>

  _layer: Layer

  constructor(coord: coord | Point, stage: Stage) {
    this._layer = make_layer('calculator', coord)
    this._weights = [];
    stage.add(this._layer)
  }

  // sama seperti di envelope.ts
  /**
   * returning indexnumber of this._weight
   * @param points 
   */
  Add(points: Array<Point>):number {
    let i = 0;
    let point = points[i];
    while (point) {
      if (points[i + 1]) {
        point.nextPoint = points[i + 1];
      }
      i += 1;
      point = points[i];
    }
    this._weights.push(points[0])
    return this._weights.length - 1;
  }

  // sama seperti di envelope.ts
  Get(index: number) {
    return this._weights[index];
  }

  Draw(index: number, config: line) {
    let fp = this._weights[index];
    fp.create_line(config)
    if (fp.line && fp.line.kline) {
      this._layer.add(fp.line.kline)
    }
    // for next point
    let np = fp.nextPoint;
    while (np) {
      if (np.line && np.line.kline) {
        this._layer.add(np.line.kline)
      }
      np = np.nextPoint;
      if (np === this._weights[index]) {
        break;
      }
    }
  }

  AttachPoint(index: number) {
    let fp = this._weights[index];
    if (fp.dot?.kshape!) {
      this._layer.add(fp.dot?.kshape!);
    }
    // for the next line
    let np = fp.nextPoint;
    while (np) {
      if (np.dot?.kshape!) {
        this._layer.add(np.dot?.kshape!);
      }
      np = np.nextPoint;
      if (np === this._weights[index]) {
        break;
      }
    }
  }
}