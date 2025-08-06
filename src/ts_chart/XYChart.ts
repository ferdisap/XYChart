import { Stage } from "konva/lib/Stage";
import { ConfigChart, align, coord, dimension, font, formulaType, line, lineCap } from "./Config";
import { Layer, LayerConfig } from "konva/lib/Layer";
import Konva from "konva";
import { Point } from "./Point";
import { Axis, draw_line_from_grid_point } from "./Axis";
import { Shape } from "konva/lib/Shape";
import { Text } from "konva/lib/shapes/Text";
import { Envelope } from "./graphic/Envlope";
import { Calculation } from "./graphic/Calculation";

export function make_layer(name: string, coord: Point|coord): Layer {
  const layer = new Konva.Layer({
    x: coord.x,
    y: coord.y,
    // Can not change width of layer. Use "stage.width(value)" function instead.
    // width: config.width,
    // height: config.height,
    name: name,
  });
  return layer
}

export function DestroyPoint(layer:LayerConfig, point:Point, deep:boolean = true){
  
}

export class XYChart {
  config: ConfigChart
  stage: Stage;
  layer: Layer; // layer ini nanti akan membuat element canvas
  envelope: Envelope
  calculation:Calculation

  constructor(config: ConfigChart) {
    if (!config.formulaType) {
      console.error("You must determine what formula type used");
      return;
    }
    this.config = config

    // instance stage
    if (!this.config.container.element) {
      this.config.container.element = document.getElementById(this.config.container.id)!
    }
    this.stage = new Konva.Stage({
      container: this.config.container.element! as HTMLDivElement,
      width: this.config.container.element.offsetWidth,
      height: this.config.container.element.offsetHeight
    })

    // adding first layer
    const axisLayerZeroPoint = new Point(this.config.container.paddingLeft, this.config.container.paddingTop, null)
    this.layer = make_layer('axis', axisLayerZeroPoint)
    this.stage.add(this.layer);

    // create new envelope class
    this.envelope = new Envelope(axisLayerZeroPoint, this.stage);

    // create new calculator class
    this.calculation = new Calculation(axisLayerZeroPoint, this.stage);
  }

  AttachAxisLine(axis: Axis) {
    if (axis.line && axis.line.kline) {
      this.layer.add(axis.line!.kline!);
    }
  }

  AttachAxisGridPoint(axis: Axis) {
    // attach axis grid into layer
    for (let i = 0; i < axis.gridPoints.length; i++) {
      const point = axis.gridPoints[i];
      // adding dot within first dot is not added
      if (point.dot?.kshape!) {
        this.layer.add(point.dot?.kshape!);
      }
    }
  }

  AddAxisGridPointLabel(points:Array<Point>, position:number, config:font) {
    // attach label on axis point
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point.name) {
        if (typeof point.name === 'string') {
          // point.create_label(position, null, Object.assign({}, this.config.font, { align: align.center }));
          point.create_name(position, null, config);
        }
        if (point.name instanceof Text) {
          this.layer.add(point.name as Shape)
        }
      }
    }
  }

  AttachAxisName(axis:Axis){
    if(axis.name){
      this.layer.add(axis.name);
    }
  }

  AddGridLineToAxis(mainGridPoints: Array<Point>, otherAxisParam: Axis, targetAxis: Axis) {
    draw_line_from_grid_point(this.config.formulaType!, mainGridPoints, otherAxisParam.gridPoints, otherAxisParam.position, targetAxis, {
      strokeColor: 'grey',
      strokeWidth: 1,
      lineCap: lineCap.round
    });
    for (let i = 0; i < mainGridPoints.length; i++) {
      const mainGridPoint = mainGridPoints[i];
      // adding line to layer
      let p = mainGridPoint;
      // console.log('gridValue:', p.value)
      while (p.nextPoint) {
        const kline = p.line?.kline!;
        this.layer.add(kline)
        p = p.nextPoint;
      }
    }
  }

  AddSubGridLineToAxis(subGridPoints: Array<Array<Point>>, otherAxisParam: Axis, targetAxis: Axis) {
    for (let i = 0; i < subGridPoints.length; i++) {
      const subGridPoint = subGridPoints[i];
      draw_line_from_grid_point(this.config.formulaType!, subGridPoint, otherAxisParam.gridPoints, otherAxisParam.position, targetAxis, {
        strokeColor: 'grey',
        strokeWidth: 0.5,
        lineCap: lineCap.round
      });
      for (let j = 0; j < subGridPoint.length; j++) {
        const point = subGridPoint[j];
        // adding line to layer
        let p = point;
        // console.log('gridValue:', p.value)
        while (p.nextPoint) {
          const kline = p.line?.kline!;
          this.layer.add(kline)
          p = p.nextPoint;
        }
        
      }
    }
  }

  AddBasicGridLineToAxis(gridPoints:Array<Point>, targetAxis:Axis, config:line){
    for (let i = 0; i < gridPoints.length; i++) {
      const mainGridPoint = gridPoints[i];
      mainGridPoint.nextPoint = new Point(targetAxis.point2.x, mainGridPoint.y, null)
      mainGridPoint.create_line(config);
      this.layer.add(mainGridPoint.line?.kline!);
    }
  }

  AddBasicSubGridLineToAxis(subGridPoints:Array<Array<Point>>, targetAxis:Axis, config:line){
    for (let i = 0; i < subGridPoints.length; i++) {
      const subGridPoint :Array<Point> = subGridPoints[i]; 
      for (let j = 0; j < subGridPoint.length; j++) {
        const point = subGridPoint[j];
        point.nextPoint = new Point(targetAxis.point2.x, point.y, null)
        // console.log(point.nextPoint)
        point.create_line(config);
        // console.log(point.line?.kline!)
        this.layer.add(point.line?.kline!);        
      }
      
    }
  }

}