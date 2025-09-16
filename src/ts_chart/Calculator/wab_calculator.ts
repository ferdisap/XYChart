import { font, line, point } from "../Config";
import { Point } from "../Point";
import { DefConfig } from "../Config";
import { XYChart } from "../XYChart";
import { Axis } from "../Axis";

/**
 * arm from datum
 */
export interface arm {
  value: number,
  unit: string,
}

export interface weight {
  name: string, // MEW,BEW,OEW,dll
  value: number,
  unit: string,
  arm: arm,
  hasSummed?:boolean,
  additional_items?: Array<weight>
}

export const weight = {
  "MEW": 1,
  "BEW": 2,
  "OEW": 3,
  "PYW": 4,
  "ZFW": 5,
  "TOW": 6,
  "TXW": 7,
}

export function create_weight_data(name: string, value: number, unit: string, arm: arm, hasSummed:boolean|null): weight {
  if(hasSummed !== null){
    return {
      name: name,
      value: value,
      unit: unit,
      arm: arm,
      hasSummed: hasSummed
    }
  } else {
    return {
      name: name,
      value: value,
      unit: unit,
      arm: arm,
    }
  }
}

export function add_item(weight: weight, item: weight, plus:boolean = true): weight | null {
  if (weight.unit !== item.unit) {
    console.error("the weight unit and additional item unit must be same.")
    return null;
  }
  if (weight.arm.unit !== item.arm.unit) {
    console.error("the arm unit and additional item arm unit must be same.")
    return null;
  }
  // set zero if NAN
  if(isNaN(weight.value)) weight.value = 0;
  if(isNaN(weight.arm.value)) weight.arm.value = 0;
  if(isNaN(item.value)) item.value = 0;
  if(isNaN(item.arm.value)) item.arm.value = 0;

  if (!weight.additional_items) {
    weight.additional_items = [];
  }
  if(plus){
    // change weight because the additional item
    const prevWeightMoment = weight.value * weight.arm.value;
    const itemMoment = item.value * item.arm.value;
    const newWeightMoment = prevWeightMoment + itemMoment;
    const newWeightValue = weight.value + item.value; // new value to set
    const newWeigtArmValue = newWeightMoment / newWeightValue; // new value to set
    // set the new to weight object
    weight.value = newWeightValue;
    weight.arm.value = newWeigtArmValue;
    // save the additional item to weight
    weight.additional_items.push(item);
  }
  else {
    // change weight because the additional item
    const prevWeightMoment = weight.value * weight.arm.value;
    const itemMoment = item.value * item.arm.value;
    const newWeightMoment = prevWeightMoment - itemMoment;
    const newWeightValue = weight.value - item.value; // new value to set
    const newWeigtArmValue = newWeightMoment / newWeightValue; // new value to set
    // set the new to weight object
    weight.value = newWeightValue;
    weight.arm.value = newWeigtArmValue;
    // save the additional item to weight
    const index_add_item = weight.additional_items.indexOf(item);
    weight.additional_items.splice(index_add_item,1);
  }
  return weight;
}

export const calculatorType = {
  "WabCalculator" : 0,
  "CN235WabCalculator": 1,
  "C212WabCalculator": 2
}

export class WabCalculator {
  _MEW: weight | null;
  _BEW: weight | null;
  _OEW: weight | null;
  _PYW: Array<weight> | null;
  _ZFW: weight | null;
  _TOW: weight | null;
  _TXW: weight | null;

  configPoint: point;
  configLine: line;
  configTooltipFont: font;

  firstPoint: Point | null;

  constructor() {
    this._MEW = null;
    this._BEW = null;
    this._OEW = null;
    this._PYW = [];
    this._ZFW = null;
    this._TOW = null;
    this._TXW = null;

    this.firstPoint = null;
    this.configPoint = DefConfig.point;
    this.configLine = DefConfig.line;
    this.configTooltipFont = DefConfig.font;
  }

  SetWeight(data: weight, type: number): weight | null {
    if (data.name && data.value && data.unit && data.arm) {
      switch (type) {
        case weight.MEW: this._MEW = data; return data;
        case weight.BEW: this._BEW = data; return data;
        case weight.OEW: this._OEW = data; return data;
        case weight.PYW: this._PYW!.push(data); return data;
        case weight.ZFW: this._ZFW = data; return data;
        case weight.TOW: this._TOW = data; return data;
        case weight.TXW: this._TXW = data; return data;
        default: return null;
      }
    } else {
      alert(`the data ${data.name} must have values of name, value, unit, and arm properties.`);
      console.error(`the data ${data.name} must have values of name, value, unit, and arm properties.`);
      return null
    }
  }

  UnsetWeight(type: number) {
    let olddata: weight | Array<weight> | null
    switch (type) {
      case weight.MEW: 
        olddata = this._MEW
        this._MEW = null; 
        return olddata;
      case weight.BEW: 
        olddata = this._BEW
        this._BEW = null; 
        return olddata;
      case weight.OEW: 
        olddata = this._OEW
        this._OEW = null; 
        return olddata;
      case weight.PYW: 
        olddata = this._PYW;
        this._PYW! = []; 
        return olddata;
      case weight.ZFW: 
        olddata = this._ZFW
        this._ZFW = null; 
        return olddata;
      case weight.TOW: 
        olddata = this._TOW
        this._TOW = null; 
        return olddata;
      case weight.TXW: 
        olddata = this._TXW
        this._TXW = null; 
        return olddata;
      default: return null;
    }
  }

  DrawToChart(chart: XYChart, weightAxis: Axis, indexUnitAxis: Axis, macAxis: Axis) {}

  Convert_To_IndexUnit(mac:number, weight:number):void | number{}
  Convert_To_Arm(indexUnit:number, weight:number):void | number{}
  Convert_To_Weight(indexUnit:number, arm:number):void | number{}
  Convert_To_Mac(cgarm:number):number|void{}
}