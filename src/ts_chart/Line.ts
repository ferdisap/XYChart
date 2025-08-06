import Konva from "konva";
import { Line as KLine } from "konva/lib/shapes/Line";
import { Point } from "./Point";
import { align, area, coord, font, line } from "./Config";
import { chunkArray, defineTextPosition, getTanDegree, getWidthOfText, objectGetKeyByValue } from "./utils";
import { Text } from "konva/lib/shapes/Text";
import { Rect } from "konva/lib/shapes/Rect";

export interface labelPoly {
  text: Text,
  rect: Rect
}

export interface areaPoly {
  line: KLine, // yang tidak ada area
  poly: KLine, // yang ada area
}

export class Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  kline: KLine | null;
  label: labelPoly | null;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.kline = null;
    this.label = null;
  }

  make_line(config: line) {
    this.kline = new Konva.Line({
      points: [this.x1, this.y1, this.x2, this.y2],
      stroke: config.strokeColor,
      strokeWidth: config.strokeWidth,
    })
  }

  /**
   * untuk membuat label pada point ke nextPoint (line agaris)
   * @param position 
   * @param text 
   * @param config 
   * @param additionalCoord 
   */
  create_label(position: number, text: string, config: font, additionalCoord: coord = { x: 0, y: 0 }) {
    const selisihX = this.x2 - this.x1;
    const selisihY = this.y2 - this.y1;
    const degree = getTanDegree(selisihY, selisihX);

    const widthText = getWidthOfText(text, config.size, config.family, 'bold');
    const textPos = defineTextPosition(position, {
      size: config.size,
      family: config.family,
      align: objectGetKeyByValue(align, config.align),
      weight: '',
      rotate: config.rotate ? config.rotate : 0
    },
      widthText, { x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 });
    const textLabel = new Konva.Text({
      x: textPos.x + additionalCoord.x,
      y: textPos.y + additionalCoord.y,
      text: text.toString(),
      fontSize: config.size,
      fontFamily: config.family,
      fill: '#000000',
      width: widthText,
      padding: 0,
      align: objectGetKeyByValue(align, config.align),
    })

    const rectLabel = new Konva.Rect({
      x: textPos.x + additionalCoord.x,
      y: textPos.y + additionalCoord.y,
      stroke: '#555',
      strokeWidth: 2,
      fill: '#ddd',
      width: widthText,
      height: textLabel.height(),
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      shadowOpacity: 0.2,
      cornerRadius: 3
    })

    textLabel.rotate(degree);
    rectLabel.rotate(degree)

    if (config.rotate) {
      textLabel.rotate(config.rotate);
      rectLabel.rotate(config.rotate);
    }
  }
}

export class Polygon {

  polycoords: Array<number>;

  /**
   * @deprecated
   */
  kline: KLine | null;

  label: labelPoly | null;
  area: areaPoly | null

  constructor(firstPoint: Point) {
    this.polycoords = [];
    let fp = firstPoint;
    while (fp.nextPoint) {
      this.polycoords.push(fp.x);
      this.polycoords.push(fp.y);
      fp = fp.nextPoint;
      if (fp === firstPoint) {
        break;
      }
    }
    this.kline = null;
  }

  get totalPoint () {
    return Math.floor(this.polycoords.length/2);
  }

  getCoord(indexTo:number) : coord | null{
    if(indexTo > -1 && indexTo < (this.totalPoint-1)){
      const coordsInArray = chunkArray(this.polycoords, 2).filter((arr:Array<number>) => arr.length === 2)[indexTo]
      return {x:coordsInArray[0], y:coordsInArray[1]};
    }
    return null
  }

  make_poly(config: area) {
    if ((config as area).fill) {
      const lpoly = new Konva.Line({
        points: this.polycoords,
        stroke: config.strokeColor,
        strokeWidth: config.strokeWidth,
        closed: true
      })

      const aPoly = new Konva.Line({
        points: this.polycoords,
        fill: (config as area).fill,
        opacity: (config as area).opacity,
        closed: true
      })

      this.area = {
        line: lpoly,
        poly: aPoly
      }
    }
  }

  /**
   * untuk membuat label pada point ke nextPoint (line agaris)
   * @param position disamping atau diatas/bawah garis
   * @param text 
   * @param config 
   * @param firstPoint index number
   * @param secondPoint index number
   * @param additionalCoord 
   */
  create_label(position: number, text: string, config: font, firstPoint:number, secondPoint:number ,additionalCoord: coord = { x: 0, y: 0 }) {
    const coord1 = this.getCoord(firstPoint);
    const coord2 = this.getCoord(secondPoint);
    if(coord1 && coord2){
      // bagi di 2 karena lokasinya di tengah antar line
      const selisihX = (coord2.x - coord1.x) / 2;
      const selisihY = (coord2.y - coord1.y) / 2;
      const degree = getTanDegree(selisihY, selisihX);
  
      const widthText = getWidthOfText(text, config.size, config.family, 'bold');
      const textPos = defineTextPosition(position, {
        size: config.size,
        family: config.family,
        align: objectGetKeyByValue(align, config.align),
        weight: '',
        rotate: config.rotate ? config.rotate : 0
      },
        widthText, coord1, coord2);
      const textLabel = new Konva.Text({
        x: textPos.x + additionalCoord.x + selisihX,
        y: textPos.y + additionalCoord.y + selisihY,
        text: text.toString(),
        fontSize: config.size,
        fontFamily: config.family,
        fill: '#000000',
        width: widthText,
        padding: 0,
        align: objectGetKeyByValue(align, config.align),
      })
      const padding = 5;
      const rectLabel = new Konva.Rect({
        x: textPos.x + additionalCoord.x + selisihX - (padding/2),
        y: textPos.y + additionalCoord.y + selisihY - (padding/2),
        stroke: '#555',
        strokeWidth: 2,
        fill: '#ddd',
        width: widthText + padding,
        height: textLabel.height() + padding,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.2,
        cornerRadius: 3
      })
  
      textLabel.rotate(degree);
      rectLabel.rotate(degree)
  
      if (config.rotate) {
        textLabel.rotate(config.rotate);
        rectLabel.rotate(config.rotate);
      }
  
      this.label = {
        text:textLabel,
        rect:rectLabel
      }
    }
  }
}