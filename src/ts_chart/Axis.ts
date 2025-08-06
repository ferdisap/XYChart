import Konva from "konva";
import { DefConfig, align, coord, font, line, point, pointType, position as positionType } from "./Config";
// import { subGridPoint } from "./GridPoint";
import { Line } from "./Line";
import { InstanceSubGridPointsByNumber, Perpoint, Point } from "./Point";
import { defineLabelPosition, defineTextPosition, getWidthOfText, objectGetKeyByValue, spread_number } from "./utils";
import { getFormulaFn } from "./wab/formula";
import { Text } from "konva/lib/shapes/Text";


/**
 * 
 * @param gridPoints 
 * @param value 
 * @returns 
 * 
 * sudah teruji di
 * function filter(v, arr){
    return arr.filter((e,i,a) => (e > v && a[i+1] < v) || (e < v && a[i-1] > v) )
  }
  filter(750, [1000,900,800,700,600].reverse()); filter(750, [1000,900,800,700,600])
 */
export function filterPoints(gridPoints: Array<Point>, value: number) {
  return gridPoints.filter((e: Point, i: number, gdpts: Array<Point>) => {
    return ((e.value! > value && (gdpts[i + 1] && gdpts[i + 1].value! < value)) || (e.value! < value && (gdpts[i - 1] && gdpts[i - 1].value! > value))) ||
      ((e.value! > value && (gdpts[i - 1] && gdpts[i - 1].value! < value)) || (e.value! < value && (gdpts[i + 1] && gdpts[i + 1].value! > value)))
  })
}

export function get_ratio_between_two_value(v: number, vp1: number, vp2: number) {
  return (v - vp1) / (vp2 - vp1);
}

/**
 * @deprecated
 * @param targetAxis 
 * @param value 
 * @returns 
 */
export function CreatePointByValue(targetAxis: Axis, value: number) {
  const filterredPoints = filterPoints(targetAxis.gridPoints, value);
  // console.log(filterredPoints)
  const ratioBetweenPoint = get_ratio_between_two_value(value, filterredPoints[0].value!, filterredPoints[1].value!);

  const lengthBeetweenTwoPoint_x = filterredPoints[1].x - filterredPoints[0].x;
  const x = filterredPoints[0].x + (lengthBeetweenTwoPoint_x * ratioBetweenPoint)
  const lengthBeetweenTwoPoint_y = filterredPoints[1].y - filterredPoints[0].y;
  const y = filterredPoints[0].y + (lengthBeetweenTwoPoint_y * ratioBetweenPoint)

  const indexUnitCoord = new Point(x, y, null);
  // console.log(y)
  return indexUnitCoord;
}

export function GetCoordByValue(targetAxis: Axis, value: number): coord {
  const filterredPoints = filterPoints(targetAxis.gridPoints, value);
  if (filterredPoints.length) {
    const ratioBetweenPoint = get_ratio_between_two_value(value, filterredPoints[0].value!, filterredPoints[1].value!);

    const lengthBeetweenTwoPoint_x = filterredPoints[1].x - filterredPoints[0].x;
    const x = filterredPoints[0].x + (lengthBeetweenTwoPoint_x * ratioBetweenPoint)
    const lengthBeetweenTwoPoint_y = filterredPoints[1].y - filterredPoints[0].y;
    const y = filterredPoints[0].y + (lengthBeetweenTwoPoint_y * ratioBetweenPoint)

    return { x: x, y: y };
  } else {
    return {
      x: targetAxis.point1.x,
      y: targetAxis.point1.y
    }
  }
}

export function draw_line_from_grid_point(formulaType: number, gridPoints: Array<Point>, paramPoints: Array<Point>, position: number, targetAxis: Axis, lineConfig: line) {
  const formula = getFormulaFn(formulaType) as Function;
  for (let i = 0; i < gridPoints.length; i++) {
    const mainGridPoint = gridPoints[i];
    const mainValue = mainGridPoint.value!; // %mac
    let j = 0;
    let startPoint = mainGridPoint;
    while (paramPoints[j]) {
      const otherAxisGridPoint = paramPoints[j];
      const paramValue = otherAxisGridPoint.value!; // weight kg
      const targetValue = formula(mainValue, paramValue) //indexUnit // nanti fungsi diganti dengan callback

      let x: number, y: number;
      // console.log(mainValue, paramValue, targetValue)
      if (position === positionType.left || position === positionType.right) {
        x = GetCoordByValue(targetAxis, targetValue).x
        y = otherAxisGridPoint.y;
      } else {
        y = GetCoordByValue(targetAxis, targetValue).y
        x = otherAxisGridPoint.x;
      }
      const endPoint = new Point(x, y, null);

      startPoint.nextPoint = endPoint;
      startPoint.create_line(lineConfig);
      startPoint = endPoint;
      j += 1;
    }
  }

}

export class Axis {
  // /**
  //  * @deprecated  nanti diganti class GridPoint
  //  */
  gridPoints: Array<Point>;

  // /**
  //  * @deprecated nanti diganti class SubGridPoint
  //  */
  subGridPoints: Array<Array<Point>>;
  point1: Point;
  point2: Point;
  line: Line | null;
  position: number;

  name: Text | null

  constructor(point1: Point, point2: Point, position: number) {
    this.point1 = point1;
    this.point2 = point2;
    this.gridPoints = [];
    this.subGridPoints = [];
    this.line = null;
    this.position = position;
    this.name = null;
  }

  create_name(text: string, config: font, additionalCoord:coord = {x:0,y:0}) {
    const widthText = getWidthOfText(text, config.size, config.family, '');
    const textPos = defineTextPosition(this.position, config,widthText,this.point1, this.point2);
    
    this.name = new Konva.Text({
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
    if(config.rotate){
      this.name.rotate(config.rotate)
    }
  }

  create_axis_line() {
    this.line = new Line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    this.line.make_line(DefConfig.line);
  }

  add_grid_point(points: Array<Point>) {
    this.gridPoints = points;
    for (let i = 0; i < this.gridPoints.length; i++) {
      const point = this.gridPoints[i];
      // basically dot has been created when instance. If not here will be created
      if (point.dot === null) {
        switch (DefConfig.point.type) {
          case pointType.circle:
            point.create_dot_circle(DefConfig.point.radius, DefConfig.point.fill)
            break;
          case pointType.rectangle:
            point.create_dot_rect(DefConfig.point.radius, DefConfig.point.fill)
            break;
        }
      }
    }
  }

  create_sub_grid_point(per: Perpoint, config: point) {
    const subpoints: Array<Array<Point>> = [];
    for (let i = 0; i < this.gridPoints.length - 1; i++) {
      const nextGridPoint = this.gridPoints[i + 1] as Point;
      if (nextGridPoint) {
        const gridPoint = this.gridPoints[i] as Point;

        // get length between point to point of grid (not sub grid point)
        const selisihValue = nextGridPoint.value! - gridPoint.value!;
        let values = spread_number(selisihValue, per.qty); // nanti hilangkan index terakhir agar tidak terdoble dengan 'nextGridPoint'
        values = values.map((no: number) => no + gridPoint.value!);

        // create point
        const points = InstanceSubGridPointsByNumber(gridPoint, gridPoint, nextGridPoint, per, [], values, '', config);
        points.splice(values.length - 1, 1) // penghilangan index terakhir agar tidak ke doble dengan 'nextGridPoint'
        subpoints.push(points);
      }
    }
    this.subGridPoints = subpoints;
  }
}