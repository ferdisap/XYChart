import { Text } from "konva/lib/shapes/Text";
import { Line, Polygon } from "./Line";
import { DefConfig, align, area, coord, font, line, point, pointType } from "./Config";
import { Circle } from "../ts_chart/Circle";
import { Rect } from "../ts_chart/Rect";
import { defineLabelPosition, getWidthOfText, objectGetKeyByValue, spread_number } from "./utils";
import Konva from "konva";
import { Shape } from "konva/lib/Shape";
import { Tooltip } from "./Tooltip";
import { Layer } from "konva/lib/Layer";


/**
 * qty: number of point be generated
 * ratio: distance point to point, if summed is 1 (each contains decimal)
 */
export interface Perpoint {
  qty: number,
  ratios: Array<number>
}

/**
 * generate array contains points with same to each distance
 * @param zeroCoord is zero coord befor the first point instanced
 * @param coord1 is the first coord to where the first point will be instanced
 * @param coord2 is the second (end) coord when the first point instance.
 * @param perpoint is number, in how much the points will be generated
 * @param labels, each point's label. If number then it will be divided to "qty.per" then multiplied by 'n' factor as often as much of qty.per number
 * @returns 
 */
export function InstanceGridPointsByNumber(zeroCoord: Point, coord1: Point, coord2: Point, perpoint: number | Perpoint, labels: number | Array<string | number>, values: number | Array<number>, unit: string, configs: point | Array<point> | null): Array<Point> {
  let per: number;
  let ratio: Array<number>;
  if (typeof perpoint === 'number') {
    // supaya ada di titik nol jadi dikurangin 1
    per = perpoint - 1;
    ratio = [0];
    for (let z = 0; z < (per); z++) {
      ratio.push(1 / (per)); // jika per 4 maka ration [0, 0.33, 0.33, 0.33]
    }
  } else {
    per = (perpoint).qty;
    ratio = perpoint.ratios;
    // misal inputnya perpoint = { qty:4, ratios: [0.25, 0.25, 0.25, 0.25]} maka ratio ditambah 0 diawal menjadi [0, 0.25, 0.25, 0.25, 0.25] supaya ada titik di nol/diawal nya
    if (ratio.length - per === 0) {
      ratio.unshift(0);
    }
  }

  // arrange config
  if (configs === null) {
    configs = []
  } else if ((configs as Object).hasOwnProperty('type') && (configs as Object).hasOwnProperty('radius')) {
    let newconfigs = [] as Array<point>;
    for (let z = 0; z <= per; z++) {
      newconfigs.push(configs as point)
    }
    configs = newconfigs;
  }

  // arrange label
  let assigned_labels: Array<string | number> = [];
  if (typeof labels === "number") {
    assigned_labels = spread_number(labels, per);
    assigned_labels.unshift('');
  }
  else assigned_labels = labels as Array<string>

  // arrange value
  let assigned_values: Array<number> = [];
  if (typeof values === "number") {
    assigned_values = spread_number(values, per)
    assigned_labels.unshift(0)
  }
  else assigned_values = values as Array<number>

  // length itu dari ujung ke ujung coordinate
  const coord_x1: number = coord1.x;
  const coord_x2: number = coord2.x;
  const coord_x_length = (coord_x2 - coord_x1) === 0 ? coord_x1 : (coord_x2 - coord_x1);

  const coord_y1: number = coord1.y;
  const coord_y2: number = coord2.y;
  const coord_y_length = (coord_y2 - coord_y1 === 0) ? coord_y1 : (coord_y2 - coord_y1);

  // crete coord for each point
  const points: Array<Point> = [];
  let prevCoord_x: number = zeroCoord.x;
  let prevCoord_y: number = zeroCoord.y;
  for (let i = 0; i <= per; i++) {
    const coord_x_length_per = (coord_x2 - coord_x1 === 0) ? coord_x_length : (((coord_x_length * ratio[i])) + prevCoord_x);
    prevCoord_x = coord_x_length_per;
    const coord_y_length_per = (coord_y2 - coord_y1 === 0) ? coord_y_length : (((coord_y_length * ratio[i])) + prevCoord_y);
    prevCoord_y = coord_y_length_per
    // if(isNaN(coord_y_length_per)){
    //   console.trace(ratio,i);
    // }
    const point = new Point(coord_x_length_per, coord_y_length_per, (configs[i] ? configs[i] : null));
    if (assigned_labels[i] || assigned_labels[i] === 0) point.setName(String(assigned_labels[i]));
    if (assigned_values[i] || assigned_labels[i] === 0) point.setValue(assigned_values[i]);
    point.setUnit(unit);

    points.push(point);
  }
  return points;
}

export function InstanceSubGridPointsByNumber(zeroCoord: Point, coord1: Point, coord2: Point, perpoint: number | Perpoint, labels: number | Array<string | number>, values: number | Array<number>, unit: string, configs: point | Array<point> | null): Array<Point> {
  let per: number;
  let ratio: Array<number>;
  if (typeof perpoint === 'number') {
    per = perpoint;
    ratio = [];
    for (let z = 0; z < (per); z++) {
      ratio.push(1 / (per)); // jika per 4 maka ration [0, 0.33, 0.33, 0.33]
    }
  } else {
    per = (perpoint).qty;
    ratio = perpoint.ratios;
  }

  // arrange config
  if (configs === null) {
    configs = []
  } else if ((configs as Object).hasOwnProperty('type') && (configs as Object).hasOwnProperty('radius')) {
    let newconfigs = [] as Array<point>;
    for (let z = 0; z <= per; z++) {
      newconfigs.push(configs as point)
    }
    configs = newconfigs;
  }

  // length itu dari ujung ke ujung coordinate
  const coord_x1: number = coord1.x;
  const coord_x2: number = coord2.x;
  const coord_x_length = (coord_x2 - coord_x1) === 0 ? coord_x1 : (coord_x2 - coord_x1);
  // console.log('length: ',coord_x_length, coord1.x, coord2.x);

  const coord_y1: number = coord1.y;
  const coord_y2: number = coord2.y;
  const coord_y_length = (coord_y2 - coord_y1 === 0) ? coord_y1 : (coord_y2 - coord_y1);

  // arrange label
  let assigned_labels: Array<string | number> = [];
  if (typeof labels === "number") {
    assigned_labels = spread_number(labels, per);
    assigned_labels.unshift('');
  }
  else assigned_labels = labels as Array<string>

  // arrange value
  let assigned_values: Array<number> = [];
  if (typeof values === "number") {
    assigned_values = spread_number(values, per)
    assigned_labels.unshift(0)
  }
  else assigned_values = values as Array<number>

  // crete coord for each point
  const points: Array<Point> = [];
  let prevCoord_x: number = zeroCoord.x;
  let prevCoord_y: number = zeroCoord.y;
  for (let i = 0; i < per; i++) {

    const coord_x_length_per = (coord_x2 - coord_x1 === 0) ? coord_x_length : (((coord_x_length * ratio[i])) + prevCoord_x);
    prevCoord_x = coord_x_length_per;

    const coord_y_length_per = (coord_y2 - coord_y1 === 0) ? coord_y_length : (((coord_y_length * ratio[i])) + prevCoord_y);
    prevCoord_y = coord_y_length_per;

    // console.log(coord_x_length, ratio[i], prevCoord_x, ((coord_x_length*ratio[i]) + prevCoord_x), coord_x_length_per)
    const point = new Point(coord_x_length_per, coord_y_length_per, (configs[i] ? configs[i] : null));

    if (assigned_labels[i] || assigned_labels[i] === 0) point.setName(String(assigned_labels[i]));
    if (assigned_values[i] || assigned_labels[i] === 0) point.setValue(assigned_values[i]);
    point.setUnit(unit);
    points.push(point);
  }
  return points;
}

export class Point {
  x: number;
  y: number

  line: Line | Polygon | null;
  dot: Circle | Rect | null;

  name: string | Text | null;
  value: number | null;
  unit: string;

  nextPoint: Point | null;

  tooltip: Tooltip | null

  constructor(x: number, y: number, config: point | null) {
    this.x = x;
    this.y = y;
    this.line = null;
    this.name = config ? (config.name ?? null) : null;
    this.value = config ? (config.value ?? 0) : 0;
    this.unit = config ? (config.unit ?? '') : '';
    this.nextPoint = null
    this.tooltip = null;
    this.dot = null;

    if (config) {
      if (config.type === pointType.circle) {
        this.create_dot_circle(config.radius, config.fill)
        this.create_tooltip(DefConfig.font);
      } else if (config.type === pointType.rectangle) {
        this.create_dot_rect(config.radius, config.fill)
        this.create_tooltip(DefConfig.font);
      }
    }
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value
  }

  getUnit() {
    return this.unit
  }

  setName(name: string): string {
    return this.name = name;
  }

  setValue(value: number): number {
    return this.value = value;
  }

  setUnit(unit: string): string {
    return this.unit = unit;
  }

  create_tooltip(config: font, text: string = '') {
    const textTooltip = text ? text : this.value + ' ' + this.unit;
    this.tooltip = new Tooltip(this, textTooltip, config)
  }

  create_dot_circle(radius: number, fill: string) {
    this.dot = new Circle(this.x, this.y, radius, fill)
    this.dot.make_circle((context: Shape, ev: MouseEvent | PointerEvent) => {
      const layer: Layer | null = context.getLayer();
      if (layer) {
        if (this.tooltip.isInstalled()) {
          this.tooltip.isShowed() ? this.tooltip.Show(false) : this.tooltip.Show(true);
        } else {
          this.tooltip.Install(context.getLayer()!)
        }
      }
    });
  }

  create_dot_rect(heightWidth: number, fill: string) {
    this.dot = new Rect((this.x - (heightWidth / 2)), (this.y - (heightWidth / 2)), heightWidth, heightWidth, fill)
    this.dot.make_rect();
  }

  /**
   * untuk menampilkan name pada point
   * @param position 
   * @param name 
   * @param config 
   */
  create_name(position: number, name: string | null, config: font) {
    if (this.name === null) {
      this.name = this.value ? String(this.value) : '';
    }
    if (typeof this.name === 'string') {
      if (name) this.name = name;
      // define x position
      const widthText = getWidthOfText(this.name as string, config.size, config.family, '');
      // const textPos = defineLabelPosition(position, this.alignType, widthText, this.fontSize, this.x, this.y);
      const textPos = defineLabelPosition(position, {
        size: config.size,
        family: config.family,
        align: objectGetKeyByValue(align, config.align),
        weight: '',
        rotate: config.rotate ? config.rotate : 0
      },
        widthText, this.x, this.y);
      if (textPos) {
        // console.log(this.name.toString())
        this.name = new Konva.Text({
          x: textPos.x,
          y: textPos.y,
          text: this.name.toString(),
          fontSize: config.size,
          fontFamily: config.family,
          fill: '#000000',
          width: widthText,
          padding: 0,
          align: objectGetKeyByValue(align, config.align),
        })
        if (config.rotate) {
          this.name.rotate(config.rotate);
        }
      }
    }
  }

  create_line(config: line = DefConfig.line) {
    if (this.nextPoint && !this.line) {
      this.line = new Line(this.x, this.y, this.nextPoint!.x, this.nextPoint!.y);
      this.line.make_line(config);
    }
    // for the next line
    let pp = this.nextPoint;
    if (pp) {
      while (pp.nextPoint && !pp.line) {
        pp.line = new Line(pp.x, pp.y, pp.nextPoint!.x, pp.nextPoint!.y);
        pp.line.make_line(config);
        pp = pp.nextPoint;
        if (pp === this) {
          break;
        }
      }
    }
  }

  // create_polygon(config: area = DefConfig.area, onEachLineCreated: Function | null) {
  create_polygon(config: area = DefConfig.area) {
    let firstPoint: Point = this;
    this.line = new Polygon(firstPoint);
    (this.line as Polygon).make_poly(config);
    // if (firstPoint.line && firstPoint.line.kline && onEachLineCreated) {
    //   onEachLineCreated(firstPoint);
    // }

    // while (firstPoint.nextPoint) {

    //   this.line = new Polygon(firstPoint.x, firstPoint.y, firstPoint.nextPoint!.x, firstPoint.nextPoint!.y);
    //   (this.line as Polygon).make_poly(config);

    //   if(firstPoint.line && firstPoint.line.kline && onEachLineCreated){
    //     onEachLineCreated(firstPoint);
    //   }
    //   firstPoint = firstPoint.nextPoint;
    //   // karena setiap point memiliki nextPoint maka ini untuk menghentikan looping
    //   if(firstPoint === this){
    //     break;
    //   }
    // }
  }

  destroy(deep:boolean = true) {
    let firstPoint = this;
    firstPoint.dot?.kshape?.destroy();
    firstPoint.line?.kline?.destroy()
    
    if(deep){
      let fp = firstPoint.nextPoint;
      while (fp) {
        fp.dot?.kshape?.destroy();
        fp.line?.kline?.destroy()
        fp = fp.nextPoint;
        if (fp === firstPoint) break;
      }
    }
  }
}

/**
 * @deprecated, untuk grid point, nanti buat class Grid isinya point-point
 */
export class GridPoint extends Point {

  // subGridPoint: Array<Point> | null

  constructor(x: number, y: number, config: point | null) {
    super(x, y, config);
  }
}