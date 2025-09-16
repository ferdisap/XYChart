import { AddButton, AddDiv, CreateDomElement } from "../Calculator/ui/domutils";
import modalShowHideBtn from '../../assets/settings-gear-svgrepo-com.svg?url';
import letterEx from '../../assets/my-font-example-logo.svg?url';
import C212_example_weight_data from '../Example/C212_example_weight_data.awb?raw';
import { create_x_ratio_end_to_end, importSvg, randStr, spread_number_to_range } from "../utils";
import { TooltipWeb } from "../Tooltip";
import { Modal } from "../Calculator/ui/Modal";
import { XYChart } from "../XYChart";
import { Axis, GetCoordByValue } from "../Axis";
import { WabChartUI } from "../WabChartUI";
import { calculatorType } from "../Calculator/wab_calculator";
import { align, ConfigChart, font, formulaType, getLineConfig, lineCap, point, position as positionType } from "../Config";
import { InstanceGridPointsByNumber, Point } from "../Point";
import { formula_index_unit_c212 } from "./formula";

function makeTopAxis(config: ConfigChart): Axis {
  const x1 = config.container.paddingLeft;
  const x2 = config.container.dimension.width - config.container.paddingLeft - config.container.paddingRight;
  const y = config.container.paddingTop;
  const point1TopAxis = new Point(x1, y, null);
  const point2TopAxis = new Point(x2, y, null);
  const ratios = create_x_ratio_end_to_end([(0.3 / 19), (4 / 19), (8 / 19), (13 / 19), (18 / 19), (19 / 19)]);
  const gridPointsAxisTop = InstanceGridPointsByNumber(point1TopAxis, point1TopAxis, point2TopAxis, { qty: 6, ratios: ratios }, ['', '12%', '16%', '20%', '25%', '30%', ''], [0, 12, 16, 20, 25, 30], '%MAC', config.point)

  // example to create tooltip on each grid poin
  for (let i = 0; i < gridPointsAxisTop.length; i++) {
    const gridPoint = gridPointsAxisTop[i];
    gridPoint.create_tooltip(config.font)
  }

  const macAxis = new Axis(point1TopAxis, point2TopAxis, positionType.top);
  macAxis.add_grid_point(gridPointsAxisTop);
  macAxis.create_axis_line();
  macAxis.create_sub_grid_point({ qty: 6, ratios: [0.05, 0.2, 0.2, 0.25, 0.25, 0.095] }, config.point)
  macAxis.create_name("% MAC", Object.assign({}, config.font, { weight: "bold", size: 18 }), { y: -20, x: 0 });
  return macAxis
}

function makeLeftAxis(config: ConfigChart): Axis {
  const x = config.container.paddingLeft;
  const y1 = config.container.paddingTop;
  const y2 = config.container.dimension.height - config.container.paddingBottom;
  const point1LeftAxis = new Point(x, y1, null);
  const point2LeftAxis = new Point(x, y2, null);
  const valuesNvaluesofAxisLeft = spread_number_to_range(4000, 500, 10);
  valuesNvaluesofAxisLeft.reverse();
  const gridPointAxisLeft = InstanceGridPointsByNumber(point1LeftAxis, point1LeftAxis, point2LeftAxis, 10, valuesNvaluesofAxisLeft, valuesNvaluesofAxisLeft, 'kg', config.point)

  const weightAxis = new Axis(point1LeftAxis, point2LeftAxis, positionType.left);
  // creating line to axiss class
  weightAxis.create_axis_line();
  // add previous instanced gridPoint to axis class
  weightAxis.add_grid_point(gridPointAxisLeft);
  // creating sub grid points to axis class
  weightAxis.create_sub_grid_point({ qty: 5, ratios: [0.20, 0.20, 0.20, 0.20, 0.20] }, config.point)
  weightAxis.create_name("Weight (kg)", Object.assign({}, config.font, { rotate: -90, align: align.center, weight: "bold", size: 18 }), { x: -20, y: 0 });
  return weightAxis;
}

function makeRightAxis(config: ConfigChart): Axis {
  const x = config.container.dimension.width - config.container.paddingLeft - config.container.paddingRight;
  const y1 = config.container.paddingTop;
  const y2 = config.container.dimension.height - config.container.paddingBottom
  const point1rightAxis = new Point(x, y1, null);
  const point2rightAxis = new Point(x, y2, null);
  const labelsNvaluesofAxisright = spread_number_to_range(4000, 500, 9);
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
  const x1 = config.container.paddingLeft;
  const x2 = config.container.dimension.width - config.container.paddingLeft - config.container.paddingRight;
  const y = config.container.dimension.height - config.container.paddingBottom;
  const point1BottomAxis = new Point(x1, y, null);
  const point2BottomAxis = new Point(x2, y, null);
  const labelsNvaluesofAxisBottom = spread_number_to_range(-1500, 500, 8)
  const gridPointAxisBottom = InstanceGridPointsByNumber(point1BottomAxis, point1BottomAxis, point2BottomAxis, 8, labelsNvaluesofAxisBottom, labelsNvaluesofAxisBottom, 'kg', config.point)
  const indexUnitAxis = new Axis(point1BottomAxis, point2BottomAxis, positionType.bottom);
  indexUnitAxis.create_axis_line();
  indexUnitAxis.add_grid_point(gridPointAxisBottom);
  indexUnitAxis.create_name("Index Unit (kgm)", Object.assign({}, config.font, { weight: "bold", size: 18 }), { x: 0, y: 40 });
  return indexUnitAxis;
}

function makeMTOWEnvelope(indexUnitAxis: Axis, weightAxis: Axis, configPoint: point, configFontTooltip: font): Array<Point> {
  configFontTooltip = Object.assign({}, configFontTooltip, { align: align.left })
  const indexUnit_point1 = formula_index_unit_c212(16, 8100);
  const point1 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point1).x,
    GetCoordByValue(weightAxis, 8100).y,
    configPoint
  );
  point1.create_dot_circle(5, 'red');
  point1.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 8100 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point1.toFixed(3) + ' kgm')

  const indexUnit_point2 = formula_index_unit_c212(27, 8100);
  const point2 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point2).x,
    GetCoordByValue(weightAxis, 8100).y,
    configPoint
  );
  point2.create_dot_circle(5, 'red');
  point2.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 8100 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point2.toFixed(3) + ' kgm')

  const indexUnit_point3 = formula_index_unit_c212(30, 8000);
  const point3 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point3).x,
    GetCoordByValue(weightAxis, 8000).y,
    configPoint
  );
  point3.create_dot_circle(5, 'red');
  point3.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 8000 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point3.toFixed(3) + ' kgm')

  const indexUnit_point4 = formula_index_unit_c212(30, 4700);
  const point4 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point4).x,
    GetCoordByValue(weightAxis, 4700).y,
    configPoint
  );
  point4.create_dot_circle(5, 'red');
  point4.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 4700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point4.toFixed(3) + ' kgm')

  const indexUnit_point5 = formula_index_unit_c212(12, 4700);
  const point5 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point5).x,
    GetCoordByValue(weightAxis, 4700).y,
    configPoint
  );
  point5.create_dot_circle(5, 'red');
  point5.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 4700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point5.toFixed(3) + ' kgm')

  const indexUnit_point6 = formula_index_unit_c212(12, 6500);
  const point6 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point6).x,
    GetCoordByValue(weightAxis, 6500).y,
    configPoint
  )
  point6.create_dot_circle(5, 'red');
  point6.create_tooltip(configFontTooltip, "MTOW/MLW\nweight: 6500 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point6.toFixed(3) + ' kgm')

  return [point1, point2, point3, point4, point5, point6];
}

function makeMZFWEnvelope(indexUnitAxis: Axis, weightAxis: Axis, configPoint: point, configFontTooltip: font): Array<Point> {
  configFontTooltip = Object.assign({}, configFontTooltip, { align: align.left })
  const indexUnit_point1 = formula_index_unit_c212(14.7, 7500);
  const point1 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point1).x,
    GetCoordByValue(weightAxis, 7500).y,
    configPoint
  );
  point1.create_dot_circle(5, 'red');
  point1.create_tooltip(configFontTooltip, "MZFW\nweight: 7500 kg,\nCG: 16% MAC,\nindex-unit: " + indexUnit_point1.toFixed(3) + ' kgm')

  const indexUnit_point2 = formula_index_unit_c212(30, 7500);
  const point2 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point2).x,
    GetCoordByValue(weightAxis, 7500).y,
    configPoint
  );
  point2.create_dot_circle(5, 'red');
  point2.create_tooltip(configFontTooltip, "MZFW\nweight: 7500 kg,\nCG: 30% MAC,\nindex-unit: " + indexUnit_point2.toFixed(3) + ' kgm')

  const indexUnit_point3 = formula_index_unit_c212(30, 4700);
  const point3 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point3).x,
    GetCoordByValue(weightAxis, 4700).y,
    configPoint
  );
  point3.create_dot_circle(5, 'red');
  point3.create_tooltip(configFontTooltip, "MZFW\nweight: 4700 kg,\nCG: 3% MAC,\nindex-unit: " + indexUnit_point3.toFixed(3) + ' kgm')

  const indexUnit_point4 = formula_index_unit_c212(12, 4700);
  const point4 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point4).x,
    GetCoordByValue(weightAxis, 4700).y,
    configPoint
  );
  point4.create_dot_circle(5, 'red');
  point4.create_tooltip(configFontTooltip, "MZFW\nweight: 4700 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point4.toFixed(3) + ' kgm')

  const indexUnit_point5 = formula_index_unit_c212(12, 6500);
  const point5 = new Point(
    GetCoordByValue(indexUnitAxis, indexUnit_point5).x,
    GetCoordByValue(weightAxis, 6500).y,
    configPoint
  );
  point5.create_dot_circle(5, 'red');
  point5.create_tooltip(configFontTooltip, "MZFW\nweight: 6500 kg,\nCG: 2% MAC,\nindex-unit: " + indexUnit_point5.toFixed(2) + ' kgm')

  return [point1, point2, point3, point4, point5];
}

class C212WabChartUI extends WabChartUI {
  _version: string = "v1.0.0";
  _owner: string = "ferdisaptoko";
  _mail = "ferdisaptoko@gmail.com";

  constructor(parentDiv: HTMLDivElement) {
    super(parentDiv);
  }

  Init() {
    // setting config
    if (!this.config.container.element) {
      this.config.container.id = this.contentDiv.id;
      this.config.container.element = this.contentDiv;
      if (!this.config.container.element) {
        console.error("there is no such element id of " + this.config.container.id);
        alert("there is no such element id of " + this.config.container.id);
        return;
      }
    }
    this.config.container.element.style.width = this.config.container.dimension.width + 'px';
    this.config.container.element.style.height = this.config.container.dimension.height + 'px';
    this.config.formulaType = formulaType.indexUnit_C212;
    Object.assign(this.config.font, { align: align.center })

    // ##### create chart
    // instance chart
    const chart = new XYChart(this.config)
    // instance axis
    const macAxis = makeTopAxis(this.config);
    const weightAxis = makeLeftAxis(this.config);
    const indexUnitAxis = makeBottomAxis(this.config);
    const rightAxis = makeRightAxis(this.config);
    // drawing axis and its atributes to chart
    chart.AttachAxisLine(macAxis); // just attach line axis (without point or grid) to layer
    chart.AddGridLineToAxis(macAxis.gridPoints, weightAxis, indexUnitAxis); // draw grid line and attach them to layer
    chart.AddSubGridLineToAxis(macAxis.subGridPoints, weightAxis, indexUnitAxis); // draw sub grid line and attach them to layer
    chart.AttachAxisGridPoint(macAxis); // attach grid point to axis
    chart.AddAxisGridPointLabel(macAxis.gridPoints, macAxis.position, this.config.font); // draw and attach grid point label to layer
    chart.AttachAxisName(macAxis);
    // draw bottom axis
    chart.AttachAxisLine(indexUnitAxis);
    chart.AttachAxisGridPoint(indexUnitAxis);
    chart.AddAxisGridPointLabel(indexUnitAxis.gridPoints, indexUnitAxis.position, Object.assign({}, this.config.font, { rotate: -45, align: align.center }));
    chart.AttachAxisName(indexUnitAxis);
    // draw left axis
    chart.AttachAxisLine(weightAxis);
    chart.AttachAxisGridPoint(weightAxis);
    chart.AddAxisGridPointLabel(weightAxis.gridPoints, weightAxis.position, this.config.font);
    chart.AddBasicGridLineToAxis(weightAxis.gridPoints, rightAxis, getLineConfig('grey', 1, lineCap.round))
    chart.AddBasicSubGridLineToAxis(weightAxis.subGridPoints, rightAxis, getLineConfig('grey', 0.5, lineCap.round))
    chart.AttachAxisName(weightAxis);
    // draw right axis
    chart.AttachAxisLine(rightAxis);

    // #### end of creating chart
    // #### create envelope
    const MTOWPointsEnvelope = makeMTOWEnvelope(indexUnitAxis, weightAxis, this.config.point, this.config.font);
    const MZFWPointsEnvelope = makeMZFWEnvelope(indexUnitAxis, weightAxis, this.config.point, this.config.font);
    // adding envelope to chart
    chart.envelope.Add(MTOWPointsEnvelope)
    chart.envelope.Draw(0, {
      fill: "#ffffff",
      opacity: 0.2,
      strokeColor: '#000000',
      strokeWidth: 2,
      lineCap: lineCap.round
    })
    chart.envelope.AttachPoint(0);
    chart.envelope.AttachLabel(0, positionType.top, "MTW/MLW", Object.assign({}, this.config.font, { weight: 'bold' }), 0, 1, { x: 120, y: 0 });
    chart.envelope.Add(MTOWPointsEnvelope)

    chart.envelope.Add(MZFWPointsEnvelope)
    chart.envelope.Draw(2, {
      fill: "#ffffff",
      opacity: 0.2,
      strokeColor: '#000000',
      strokeWidth: 2,
      lineCap: lineCap.round
    })
    chart.envelope.AttachPoint(2);
    chart.envelope.AttachLabel(2, positionType.bottom, "MZFW", Object.assign({}, this.config.font, { weight: 'bold' }), 0, 1, { x: 0, y: 0 });
    // #### end of creating envelope


    // create modal
    const calculator = calculatorType.C212WabCalculator;
    this._modal = new Modal(this.contentDiv as HTMLDivElement, calculator, chart, macAxis, rightAxis, indexUnitAxis, weightAxis);
    const buttonOpenModal = AddButton(this.toolbarDiv, importSvg(modalShowHideBtn), "open/close modal", [], null)
    new TooltipWeb(buttonOpenModal, () => this._modal!.ShowModal(null));
    this._modal.ShowModal(false);

    // create example
    const exampleButton = AddButton(this.toolbarDiv, importSvg(letterEx), 'Example', [], null);
    new TooltipWeb(exampleButton, () => {
      this._modal?.MakeExample(JSON.parse(C212_example_weight_data));
      // this._modal!.ShowModal(null)
    });

    // footage
    AddDiv(this.contentDiv, "wab-version", this._version)
    const owner = AddDiv(this.contentDiv, "wab-owner", "@" + this._owner)
    owner.addEventListener('click', () => {
      const a = CreateDomElement('a', '', "@" + this._owner);
      a.setAttribute('href', "mailto:" + this._mail);
      a.click();
    })
  }
}

export function Create_C212WabChartUI(parentDiv: HTMLElement) {
  const mainContainer = AddDiv(parentDiv);
  mainContainer.setAttribute('id', randStr(5));

  const wabchart = new C212WabChartUI(mainContainer as HTMLDivElement);
  wabchart.Init();
}