/**
 * @deprecated
 * FILE ini nanti diganti dengan clas WabChartUI
 * 
 * 
 *  */ 



import { ConfigChart, dimension, getLineConfig, lineCap, point, pointType, position as positionType } from '../Config'
import { Axis, filterPoints, GetCoordByValue } from "../Axis";
import { line, DefConfig, formulaType } from "../Config";
import { InstanceGridPointsByNumber, Point } from "../Point";
import { XYChart } from "../XYChart";
import { create_x_ratio_end_to_end, importSvg, spread_number_to_range } from '../utils'
import { formula_cgarm_from_IndexUnit, formula_index_unit_cn_235, formula_max_cn_235 } from './formula';
import { add_item, calculatorType, create_weight_data, weight } from '../Calculator/wab_calculator';
import { CN235WabCalculator } from '../Calculator/wab_cn_235_calculator';
import { UIWabInput } from '../Calculator/ui/UIWabInput';
import { Modal } from '../Calculator/ui/Modal';
import { AddDiv, CreateDomElement } from '../Calculator/ui/domutils';
import modalShowHideBtn from '../../assets/settings-gear-svgrepo-com.svg?url'

const containerW = 800;
const containerH = 600;

function makeTopAxis(config: ConfigChart): Axis {
  const x1 = config.container.paddingLeft;
  const x2 = containerW - config.container.paddingLeft - config.container.paddingRight;
  const y = config.container.paddingTop;
  const point1TopAxis = new Point(x1, y, null);
  const point2TopAxis = new Point(x2, y, null);
  const ratios = create_x_ratio_end_to_end([(3 / 150), (22 / 150), (46 / 150), (79 / 150), (110 / 150), (141 / 150)]);
  const gridPointsAxisTop = InstanceGridPointsByNumber(point1TopAxis, point1TopAxis, point2TopAxis, { qty: 6, ratios: ratios }, ['', '15%', '16%', '20%', '25%', '30%', '35%'], [10, 15, 16, 20, 25, 30, 35], '%MAC', config.point)

  // example to create tooltip on each grid point
  for (let i = 0; i < gridPointsAxisTop.length; i++) {
    const gridPoint = gridPointsAxisTop[i];
    gridPoint.create_tooltip(config.font)
  }

  const topAxis = new Axis(point1TopAxis, point2TopAxis, positionType.top);
  topAxis.add_grid_point(gridPointsAxisTop);
  topAxis.create_axis_line();
  topAxis.create_sub_grid_point({ qty: 3, ratios: [0.33333, 0.33333, 0.33333] }, config.point)
  return topAxis
}

function makeLeftAxis(config: ConfigChart): Axis {
  const x = config.container.paddingLeft;
  const y1 = config.container.paddingTop;
  const y2 = containerH - config.container.paddingBottom
  const point1LeftAxis = new Point(x, y1, null);
  const point2LeftAxis = new Point(x, y2, null);
  const valuesNvaluesofAxisLeft = spread_number_to_range(8000, 1000, 10);
  valuesNvaluesofAxisLeft.reverse();
  const gridPointAxisLeft = InstanceGridPointsByNumber(point1LeftAxis, point1LeftAxis, point2LeftAxis, 10, valuesNvaluesofAxisLeft, valuesNvaluesofAxisLeft, 'kg', config.point)

  const leftAxis = new Axis(point1LeftAxis, point2LeftAxis, positionType.left);
  // creating line to axiss class
  leftAxis.create_axis_line();
  // add previous instanced gridPoint to axis class
  leftAxis.add_grid_point(gridPointAxisLeft);
  // creating sub grid points to axis class
  leftAxis.create_sub_grid_point({ qty: 4, ratios: [0.25, 0.25, 0.25, 0.25] }, config.point)
  return leftAxis;
}

// const length_stage = (containerW - config.container.paddingLeft - config.container.paddingRight) - (config.container.paddingLeft)
function makeRightAxis(config: ConfigChart): Axis {
  const x = containerW - config.container.paddingLeft - config.container.paddingRight;
  const y1 = config.container.paddingTop;
  const y2 = containerH - config.container.paddingBottom
  const point1rightAxis = new Point(x, y1, null);
  const point2rightAxis = new Point(x, y2, null);
  const labelsNvaluesofAxisright = spread_number_to_range(8000, 1000, 10);
  labelsNvaluesofAxisright.reverse();

  // create axis
  const gridPointAxisright = InstanceGridPointsByNumber(point1rightAxis, point1rightAxis, point2rightAxis, 10, labelsNvaluesofAxisright, labelsNvaluesofAxisright, 'kg', config.point)
  const rightAxis = new Axis(point1rightAxis, point2rightAxis, positionType.right);

  // create line axis
  rightAxis.create_axis_line();
  // create grid point of axis
  rightAxis.add_grid_point(gridPointAxisright);
  return rightAxis;
}

function makeBottomAxis(config: ConfigChart): Axis {
  const x1 = config.container.paddingBottom;
  const x2 = containerW - config.container.paddingLeft - config.container.paddingRight;
  const y = containerH - config.container.paddingBottom;
  const point1BottomAxis = new Point(x1, y, null);
  const point2BottomAxis = new Point(x2, y, null);
  const labelsNvaluesofAxisBottom = spread_number_to_range(-5500, 500, 22)
  const gridPointAxisBottom = InstanceGridPointsByNumber(point1BottomAxis, point1BottomAxis, point2BottomAxis, 22, labelsNvaluesofAxisBottom, labelsNvaluesofAxisBottom, 'kg', config.point)
  const bottomAxis = new Axis(point1BottomAxis, point2BottomAxis, positionType.bottom);
  bottomAxis.create_axis_line();
  bottomAxis.add_grid_point(gridPointAxisBottom);
  return bottomAxis;
}

function makeMTWEnvelope(indexUnitAxis: Axis, weightAxis: Axis, config: point): Array<Point> {
  const indexUnit_point1 = formula_index_unit_cn_235(16, 16550);
  const point1 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point1).x,
    GetCoordByValue(weightAxis, 16550).y,
    config
  );
  point1.create_dot_circle(5, 'red');
  point1.create_tooltip(DefConfig.font, "MTW\nweight: 16550 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point1.toFixed(2) + ' kgm')

  const indexUnit_point2 = formula_index_unit_cn_235(30, 16550);
  const point2 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point2).x,
    GetCoordByValue(weightAxis, 16550).y,
    config
  );
  point2.create_dot_circle(5, 'red');
  point2.create_tooltip(DefConfig.font, "MTW\nweight: 16550 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point2.toFixed(2) + ' kgm')

  const indexUnit_point3 = formula_index_unit_cn_235(30, 9400);
  const point3 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point3).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  );
  point3.create_dot_circle(5, 'red');
  point3.create_tooltip(DefConfig.font, "MTW\nweight: 9400 kg,\nCG: 3% MAC,\nindex-unit: " + indexUnit_point3.toFixed(2) + ' kgm')

  const indexUnit_point4 = formula_index_unit_cn_235(24, 8700);
  const point4 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point4).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point4.create_dot_circle(5, 'red');
  point4.create_tooltip(DefConfig.font, "MTW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point4.toFixed(2) + ' kgm')

  const indexUnit_point5 = formula_index_unit_cn_235(23, 8700);
  const point5 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point5).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point5.create_dot_circle(5, 'red');
  point5.create_tooltip(DefConfig.font, "MTW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point5.toFixed(2) + ' kgm')

  const indexUnit_point6 = formula_index_unit_cn_235(16, 9400);
  const point6 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point6).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  )
  point6.create_dot_circle(5, 'red');
  point6.create_tooltip(DefConfig.font, "MTW\nweight: 9400 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point6.toFixed(2) + ' kgm')

  return [point1, point2, point3, point4, point5, point6];
}

function makeMTOWEnvelope(indexUnitAxis: Axis, weightAxis: Axis, config: point): Array<Point> {
  const indexUnit_point1 = formula_index_unit_cn_235(16, 16500);
  const point1 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point1).x,
    GetCoordByValue(weightAxis, 16500).y,
    config
  );
  point1.create_dot_circle(5, 'red');
  point1.create_tooltip(DefConfig.font, "MTOW\nweight: 16500 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point1.toFixed(2) + ' kgm')

  const indexUnit_point2 = formula_index_unit_cn_235(30, 16500);
  const point2 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point2).x,
    GetCoordByValue(weightAxis, 16500).y,
    config
  );
  point2.create_dot_circle(5, 'red');
  point2.create_tooltip(DefConfig.font, "MTOW\nweight: 16500 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point2.toFixed(2) + ' kgm')

  const indexUnit_point3 = formula_index_unit_cn_235(30, 9400);
  const point3 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point3).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  );
  point3.create_dot_circle(5, 'red');
  point3.create_tooltip(DefConfig.font, "MTOW\nweight: 9400 kg,\nCG: 3% MAC,\nindex-unit: " + indexUnit_point3.toFixed(2) + ' kgm')

  const indexUnit_point4 = formula_index_unit_cn_235(24, 8700);
  const point4 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point4).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point4.create_dot_circle(5, 'red');
  point4.create_tooltip(DefConfig.font, "MTOW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point4.toFixed(2) + ' kgm')

  const indexUnit_point5 = formula_index_unit_cn_235(23, 8700);
  const point5 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point5).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point5.create_dot_circle(5, 'red');
  point5.create_tooltip(DefConfig.font, "MTOW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point5.toFixed(2) + ' kgm')

  const indexUnit_point6 = formula_index_unit_cn_235(16, 9400);
  const point6 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point6).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  )
  point6.create_dot_circle(5, 'red');
  point6.create_tooltip(DefConfig.font, "MTOW\nweight: 9400 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point6.toFixed(2) + ' kgm')

  return [point1, point2, point3, point4, point5, point6];
}

function makeMZFWEnvelope(indexUnitAxis: Axis, weightAxis: Axis, config: point): Array<Point> {
  const indexUnit_point1 = formula_index_unit_cn_235(16, 15400);
  const point1 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point1).x,
    GetCoordByValue(weightAxis, 15400).y,
    config
  );
  point1.create_dot_circle(5, 'red');
  point1.create_tooltip(DefConfig.font, "MZFW\nweight: 15400 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point1.toFixed(2) + ' kgm')

  const indexUnit_point2 = formula_index_unit_cn_235(30, 15400);
  const point2 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point2).x,
    GetCoordByValue(weightAxis, 15400).y,
    config
  );
  point2.create_dot_circle(5, 'red');
  point2.create_tooltip(DefConfig.font, "MZFW\nweight: 15400 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point2.toFixed(2) + ' kgm')

  const indexUnit_point3 = formula_index_unit_cn_235(30, 9400);
  const point3 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point3).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  );
  point3.create_dot_circle(5, 'red');
  point3.create_tooltip(DefConfig.font, "MZFW\nweight: 9400 kg,\nCG: 3% MAC,\nindex-unit: " + indexUnit_point3.toFixed(2) + ' kgm')

  const indexUnit_point4 = formula_index_unit_cn_235(24, 8700);
  const point4 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point4).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point4.create_dot_circle(5, 'red');
  point4.create_tooltip(DefConfig.font, "MZFW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point4.toFixed(2) + ' kgm')

  const indexUnit_point5 = formula_index_unit_cn_235(23, 8700);
  const point5 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point5).x,
    GetCoordByValue(weightAxis, 8700).y,
    config
  );
  point5.create_dot_circle(5, 'red');
  point5.create_tooltip(DefConfig.font, "MZFW\nweight: 8700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point5.toFixed(2) + ' kgm')

  const indexUnit_point6 = formula_index_unit_cn_235(16, 9400);
  const point6 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point6).x,
    GetCoordByValue(weightAxis, 9400).y,
    config
  )
  point6.create_dot_circle(5, 'red');
  point6.create_tooltip(DefConfig.font, "MZFW\nweight: 9400 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point6.toFixed(2) + ' kgm')

  return [point1, point2, point3, point4, point5, point6];
}

export function run(config: ConfigChart) {

  if (!config.container.element) {
    config.container.element = document.getElementById(config.container.id)!
  }
  config.container.element.style.width = config.container.dimension.width + 'px';
  config.container.element.style.height = config.container.dimension.height + 'px';

  config.formulaType = formulaType.indexUnit_CN235
  const chart = new XYChart(config)

  // create axis
  const topAxis = makeTopAxis(config);
  const leftAxis = makeLeftAxis(config);
  const bottomAxis = makeBottomAxis(config);
  const rightAxis = makeRightAxis(config);
  // draw top axis
  chart.AttachAxisLine(topAxis); // just attach line axis (without point or grid) to layer
  chart.AddGridLineToAxis(topAxis.gridPoints, leftAxis, bottomAxis); // draw grid line and attach them to layer
  chart.AddSubGridLineToAxis(topAxis.subGridPoints, leftAxis, bottomAxis); // draw sub grid line and attach them to layer
  chart.AttachAxisGridPoint(topAxis); // attach grid point to axis
  chart.AddAxisGridPointLabel(topAxis.gridPoints, topAxis.position); // draw and attach grid point label to layer
  // draw bottom axis
  chart.AttachAxisLine(bottomAxis);
  chart.AttachAxisGridPoint(bottomAxis);
  chart.AddAxisGridPointLabel(bottomAxis.gridPoints, bottomAxis.position);
  // draw left axis
  chart.AttachAxisLine(leftAxis);
  chart.AttachAxisGridPoint(leftAxis);
  chart.AddAxisGridPointLabel(leftAxis.gridPoints, leftAxis.position);
  chart.AddBasicGridLineToAxis(leftAxis.gridPoints, rightAxis, getLineConfig('grey', 1, lineCap.round))
  chart.AddBasicSubGridLineToAxis(leftAxis.subGridPoints, rightAxis, getLineConfig('grey', 0.5, lineCap.round))
  // draw right axis
  chart.AttachAxisLine(rightAxis);

  // start to draw envelope
  const MTWPointsEnvelope = makeMTWEnvelope(bottomAxis, leftAxis, config.point)
  const MZFWPointsEnvelope = makeMZFWEnvelope(bottomAxis, leftAxis, config.point)
  const MTOWPointsEnvelope = makeMTOWEnvelope(bottomAxis, leftAxis, config.point)

  chart.envelope.Add(MTWPointsEnvelope)
  chart.envelope.Draw(0, {
    fill: "#eded19ff",
    opacity: 0.5,
    strokeColor: '#000000',
    strokeWidth: 2,
    lineCap: lineCap.round
  })
  chart.envelope.AttachPoint(0);

  chart.envelope.Add(MTOWPointsEnvelope)
  chart.envelope.Draw(1, {
    fill: "#35ed19ff",
    opacity: 0.5,
    strokeColor: '#000000',
    strokeWidth: 2,
    lineCap: lineCap.round
  })
  chart.envelope.AttachPoint(1);

  chart.envelope.Add(MZFWPointsEnvelope)
  chart.envelope.Draw(2, {
    fill: "#f3a601ff",
    opacity: 0.5,
    strokeColor: '#000000',
    strokeWidth: 2,
    lineCap: lineCap.round
  })
  chart.envelope.AttachPoint(2);
  // end of drawing envelope

  // // start to draw calculation example
  // // contoh ke 1
  // const MEW_Weight = 10358;
  // const MEW_Arm = 10.270;
  // const MEW_Mac = (formula_max_cn_235(MEW_Arm));
  // const MEW_IndexUnit = formula_index_unit_cn_235(MEW_Mac, MEW_Weight);
  // const MEW_Point = new Point(
  //   GetCoordByValue(bottomAxis, MEW_IndexUnit).x,
  //   GetCoordByValue(leftAxis, MEW_Weight).y, config.point
  // )
  // MEW_Point.setName('MEW')
  // MEW_Point.create_dot_circle(5, 'red');
  // MEW_Point.create_tooltip(DefConfig.font, "MEW\nweight: 10358 kg,\nCG: "+ MEW_Mac +"% MAC,\nindex-unit: " + MEW_IndexUnit.toFixed(2) + ' kgm')

  // const BEW_Weight = 10438.953;
  // const BEW_Arm = 10.265;
  // const BEW_Mac = (formula_max_cn_235(BEW_Arm));
  // const BEW_IndexUnit = formula_index_unit_cn_235(BEW_Mac, BEW_Weight);
  // const BEW_Point = new Point(
  //   GetCoordByValue(bottomAxis, BEW_IndexUnit).x,
  //   GetCoordByValue(leftAxis, BEW_Weight).y, config.point
  // )
  // BEW_Point.setName('BEW')
  // BEW_Point.create_dot_circle(5, 'red');
  // BEW_Point.create_tooltip(DefConfig.font, "BEW\nweight: 10438.95 kg,\nCG: "+ BEW_Mac +"% MAC,\nindex-unit: " + BEW_IndexUnit.toFixed(2) + ' kgm')

  // const OEW_Weight = 11142.873;
  // const OEW_Arm = 10.158;
  // const OEW_Mac = (formula_max_cn_235(OEW_Arm));
  // const OEW_IndexUnit = formula_index_unit_cn_235(OEW_Mac, OEW_Weight);
  // const OEW_Point = new Point(
  //   GetCoordByValue(bottomAxis, OEW_IndexUnit).x,
  //   GetCoordByValue(leftAxis, OEW_Weight).y, config.point
  // )
  // OEW_Point.setName('OEW')
  // OEW_Point.create_dot_circle(5, 'red');
  // OEW_Point.create_tooltip(DefConfig.font, "OEW\nweight: 11142.87 kg,\nCG: "+ OEW_Mac +"% MAC,\nindex-unit: " + OEW_IndexUnit.toFixed(2) + ' kgm')

  // // console.log(MEW_Point.x, BEW_Point.x, OEW_Point.x)

  // BEW_Point.nextPoint = OEW_Point;
  // MEW_Point.nextPoint = BEW_Point;

  // console.log(MEW_Point)
  
  // chart.calculation.Add([MEW_Point]);
  // chart.calculation.AttachPoint(0)
  // chart.calculation.Draw(0, config.line);

  // console.log(MEW_Point.x, MEW_Point.nextPoint.x)

  // contoh ke 2
  // const MEW_Weight = create_weight_data('MEW', 10358.199, 'kg', { value:10.270, unit:'m' });
  // const BEW_Weight = create_weight_data('BEW', 10438.953, 'kg', { value: 10.265, unit: 'm'})
  // const OEW_Weight = create_weight_data('OEW', 11142.873, 'kg', { value: 10.158, unit: 'm'})

  // const PYW1_Weight = create_weight_data('PYW1', 170, 'kg', { value: 8.1, unit: 'm'})
  // const PYW2_Weight = create_weight_data('PYW2', 170, 'kg', { value: 8.43, unit: 'm'})
  // const PYW3_Weight = create_weight_data('PYW3', 170, 'kg', { value: 8.9, unit: 'm'})
  // const PYW4_Weight = create_weight_data('PYW4', 170, 'kg', { value: 13.18, unit: 'm'})

  // const ZFW_Weight = create_weight_data('ZFW', 0, 'kg', { value: 0, unit: 'm'});
  // add_item(ZFW_Weight, OEW_Weight);
  // add_item(ZFW_Weight, PYW1_Weight);
  // add_item(ZFW_Weight, PYW2_Weight);
  // add_item(ZFW_Weight, PYW3_Weight);
  // add_item(ZFW_Weight, PYW4_Weight);

  // const fuelWeightMain = create_weight_data('Fuel Weight', 1500, 'kg', { value: formula_cgarm_from_IndexUnit(254, 1500), unit: 'm'})
  // const fuelWeightAux = create_weight_data('Fuel Weight', 2000, 'kg', { value: 10.470, unit: 'm'})

  // const TOW_Weight = create_weight_data('ZFW', 0, 'kg', { value: 0, unit: 'm'});
  // add_item(TOW_Weight, ZFW_Weight);
  // add_item(TOW_Weight, fuelWeightMain);
  // add_item(TOW_Weight, fuelWeightAux);

  // const calculator = new CN235WabCalculator();
  // calculator.SetWeight(MEW_Weight, weight.MEW);
  // calculator.SetWeight(BEW_Weight, weight.BEW);
  // calculator.SetWeight(OEW_Weight, weight.OEW);
  // calculator.SetWeight(ZFW_Weight, weight.ZFW);
  // calculator.SetWeight(TOW_Weight, weight.TOW);

  // calculator.DrawToChart(chart, leftAxis, bottomAxis);
  // // end of drawing calculation example
  
  // create UI
  // const wabUIInput = new UIWabInput(config.container.element, new CN235WabCalculator, chart, topAxis, rightAxis, bottomAxis, leftAxis);

  // create modal
  // const modal = new Modal(config.container.element! as HTMLDivElement, calculatorType.CN235WabCalculator, chart, topAxis, rightAxis, bottomAxis, leftAxis);
  // modal.ShowModal(false);

  // create show/hide modal button 
  // const toolsContainer = AddDiv(config.container.element, 'tools-container');
  // const showHideModalButtonDiv = AddDiv(toolsContainer, 'tools-btn-container');
  // const showHideButton = CreateDomElement('button', 'tools-btn', importSvg(modalShowHideBtn));
  // showHideModalButtonDiv.appendChild(showHideButton)
  // showHideButton.addEventListener('click', () => modal.ShowModal(null))

  // destroy calc
  // top.destroy = () => modal.DestroyWabInputUI(modal.wabInputsUiID[0]);
  // end of create modal
}


