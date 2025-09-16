import { Axis, GetCoordByValue } from "../Axis";
import { align, position } from "../Config";
import { Point } from "../Point";
import { formula_cgarm_from_IndexUnit, formula_index_unit_cn_235, formula_mac_c_212 } from "../wab/formula";
import { XYChart } from "../XYChart";
import { DefConfig } from "../Config";
import { WabCalculator, weight } from "./wab_calculator";

export class C212WabCalculator extends WabCalculator {

  constructor() {
    super();
  }

  DrawToChart(chart: XYChart, weightAxis: Axis, indexUnitAxis: Axis, macAxis: Axis) {
    const createdPoint1 = [
      this.generatePoint("MEW", this._MEW, weightAxis, indexUnitAxis),
      this.generatePoint("BEW", this._BEW, weightAxis, indexUnitAxis),
      this.generatePoint("OEW", this._OEW, weightAxis, indexUnitAxis),
    ].filter((v: Point | null) => v);

    const createdPoint2 = this._PYW!.map((wgt: weight) => {
      return this.generatePoint("PYW", wgt, weightAxis, indexUnitAxis)
    }).filter((v: Point | null | void) => v) as Array<any>;

    const createdPoint3 = [
      this.generatePoint("ZFW", this._ZFW, weightAxis, indexUnitAxis),
      this.generatePoint("TOW", this._TOW, weightAxis, indexUnitAxis),
      this.generatePoint("TXW", this._TXW, weightAxis, indexUnitAxis),
    ].filter((v: Point | null) => v);

    const createdPoint = createdPoint1.concat(createdPoint2, createdPoint3);
    if (createdPoint.length) {
      let fp: Point = createdPoint[0]!;
      for (let i = 1; i < createdPoint.length; i++) {
        const point = createdPoint[i]!;
        fp.nextPoint = point
        fp = point;
      }
      const calculationIndex = chart.calculation.Add([createdPoint[0]!]);
      chart.calculation.AttachPoint(calculationIndex)
      chart.calculation.Draw(calculationIndex, this.configLine);
      this.firstPoint = createdPoint[0];
    }
  }

  private generatePoint(name: string, weightData: weight | null, weightAxis: Axis, indexUnitAxis: Axis): Point | null {
    if (weightData) {
      const WMac = (formula_mac_c_212(weightData.arm.value));
      const WIndexUnit = formula_index_unit_cn_235(WMac, weightData.value);

      const indexUnitPosition = indexUnitAxis.position;

      const x = (indexUnitPosition === position.bottom || indexUnitPosition === position.top) ? GetCoordByValue(indexUnitAxis, WIndexUnit).x : GetCoordByValue(indexUnitAxis, WIndexUnit).y;
      const y = (weightAxis.position === position.left || weightAxis.position === position.right) ? GetCoordByValue(weightAxis, weightData.value).y : GetCoordByValue(weightAxis, weightData.value).x
      const WPoint = new Point(x, y, this.configPoint);

      WPoint.setName(name)
      WPoint.create_dot_circle(this.configPoint.radius, this.configPoint.fill);
      WPoint.create_tooltip(Object.assign(DefConfig.font, { align: align.left }),
        name + "\nweight: " + weightData.value + " " + weightData.unit + ",\nCG: " + WMac.toFixed(2) + "% MAC,\nindex-unit: " + WIndexUnit.toFixed(2) + ' ' + weightData.unit + weightData.arm.unit
      );
      return WPoint;
    }
    return null
  }

  /**
   * 
   * @param mac in % mac
   * @param weight
   */
  Convert_To_IndexUnit(mac:number, weight:number):number{
    return formula_index_unit_cn_235(mac, weight);
  }
  Convert_To_Weight(indexUnit:number, arm:number):number{
    return indexUnit/arm;
  }
  Convert_To_Arm(indexUnit:number, weight:number):number{
    return formula_cgarm_from_IndexUnit(indexUnit, weight)
  }
  Convert_To_Mac(cgarm:number):number{
    return formula_mac_c_212(cgarm)
  }
}