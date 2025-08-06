import { Layer } from "konva/lib/Layer";
import { Axis } from "../../Axis";
import { DestroyPoint, XYChart } from "../../XYChart";
import { calculatorType, WabCalculator, weight } from "../wab_calculator";
import { AddButton, AddDiv, CreateDomElement, InsertDomElementAfter, InsertDomElementBefore } from "./domutils";
import { UIWabInput } from "./UIWabInput";
import closeSvg from '../../../assets/delete-1487-svgrepo-com.svg?url';
import addSvg from '../../../assets/add-svgrepo-com.svg?url';
import { importSvg, show } from "../../utils";
import { CN235WabCalculator } from "../wab_cn_235_calculator";
import { TooltipWeb } from "../../Tooltip";
import { DefConfig, line } from "../../Config";

// function stylingContainerDiv(containerDiv: HTMLDivElement) {
//   containerDiv.parentElement!.style.position = 'relative';
//   containerDiv.style.position = 'absolute';
//   containerDiv.style.top = '0';
//   containerDiv.style.left = '0';
//   containerDiv.style.width = '100%';
//   containerDiv.style.height = '100%';
//   containerDiv.style.backgroundColor = 'aliceblue'
// }
// function stylingTabDiv(tabDiv: HTMLDivElement) {
//   tabDiv.style.display = 'flex';
//   tabDiv.style.alignItems = 'center';
// }
// function stylingContentDiv(contentDiv: HTMLDivElement) {
//   contentDiv.style.display = 'block'
//   contentDiv.style.width = '100%';
//   contentDiv.style.height = '100%';
//   contentDiv.style.overflow = 'auto';
// }
// function styleingTabItem(modalTabItem: HTMLDivElement) {
//   const modalTabItemText = modalTabItem.firstElementChild as HTMLElement;
//   const modalTabItemClosedBtn = modalTabItemText!.nextElementSibling as HTMLElement;

//   modalTabItem.style.display = 'flex';
//   modalTabItem.style.alignItems = 'center'
//   modalTabItem.style.padding = "0 3px 0 3px"

//   modalTabItemClosedBtn.style.margin = "0 0 0 3px"
//   modalTabItemClosedBtn.style.padding = "0 1px 0 1px"
//   modalTabItemClosedBtn.style.display = 'flex';
//   modalTabItemClosedBtn.style.alignItems = 'center';

// }

export class Modal {
  containerDiv: HTMLDivElement;
  tabDiv: HTMLDivElement;
  contentDiv: HTMLDivElement;

  wabInputsUi: Array<UIWabInput>
  wabInputsUiID: Array<string>

  calculator: typeof CN235WabCalculator | typeof WabCalculator;
  chart: XYChart;
  macAxis: Axis;
  rightAxis: Axis;
  indexUnitAxis: Axis;
  weightAxis: Axis;

  addWabInputUIButton: HTMLDivElement;

  constructor(parentDiv: HTMLDivElement, calculator: number, chart: XYChart, macAxis: Axis, rightAxis: Axis, indexUnitAxis: Axis, weightAxis: Axis) {
    this.containerDiv = AddDiv(parentDiv, 'modal-container');
    this.tabDiv = AddDiv(this.containerDiv, 'modal-tab-container');
    this.contentDiv = AddDiv(this.containerDiv, 'modal-content-container');

    if (calculator === calculatorType.CN235WabCalculator) this.calculator = CN235WabCalculator;
    else this.calculator = WabCalculator;
    this.chart = chart;
    this.macAxis = macAxis;
    this.rightAxis = rightAxis;
    this.indexUnitAxis = indexUnitAxis;
    this.weightAxis = weightAxis;

    // stylingContainerDiv(this.containerDiv);
    // stylingTabDiv(this.tabDiv);
    // stylingContentDiv(this.contentDiv);

    this.wabInputsUi = [];
    this.wabInputsUiID = [];

    this.addWabInputUIButton = AddButton(this.tabDiv, importSvg(addSvg), 'Add New Calculation', ['modal-new-calc-btn'], null);
    new TooltipWeb(this.addWabInputUIButton, () => this.AddWabInputUI());
  }

  showAll(state: boolean) {
    // this.wabInputsUi.map((ui: UIWabInput) => ui.mainDiv.parentElement).forEach((container: HTMLElement | null) => show(state ? 1 : 0, container as HTMLElement))
    this.wabInputsUi.map((ui: UIWabInput) => ui.mainDiv.parentElement).forEach((container: HTMLElement | null) => show(state ? 1 : 0, container as HTMLElement))
    this.tabDiv.querySelectorAll(".modal-tab-item").forEach((el: Element) => (el as HTMLElement).classList.remove('selected'));
  }

  AddWabInputUI(judul: string | null = null, configLine:line | null = null): UIWabInput {
    const container = AddDiv(this.contentDiv);
    const calculator = new this.calculator();
    if(configLine) calculator.configLine = configLine;
    const wabInputUi = new UIWabInput(container, calculator, this.chart, this.macAxis, this.rightAxis, this.indexUnitAxis, this.weightAxis);

    this.wabInputsUi.push(wabInputUi);
    this.wabInputsUiID.push(wabInputUi.id);

    const title = judul ? judul : "No: " + this.wabInputsUi.length.toString();
    wabInputUi.title = title;

    // make tab
    const tab = CreateDomElement('div', 'modal-tab-item');
    const text = AddDiv(tab, 'modal-tab-item-text', title);
    const closeBtn = AddButton(tab, importSvg(closeSvg), "Destroy calculation", ['modal-tab-item-closebtn'], null)
    InsertDomElementBefore(tab, this.addWabInputUIButton)
    tab.setAttribute('target', wabInputUi.id);

    new TooltipWeb(text, () => {
      this.showAll(false);
      show(1, container);
      tab.classList.add('selected');
    }, 'Select ' + title);
    new TooltipWeb(closeBtn, () => this.DestroyWabInputUI(wabInputUi.id));

    this.showAll(false)
    show(1, container);
    tab.classList.add('selected')

    return wabInputUi;
  }

  DestroyWabInputUI(id: string | UIWabInput) {
    let index: number;
    if (typeof id === 'string') {
      index = this.wabInputsUiID.indexOf(id);
    } else {
      index = this.wabInputsUi.indexOf(id);
    }

    const wabInputUI = this.wabInputsUi[index];
    // const layer: Layer = wabInputUI.chart.layer; // to remove first point
    const firstPoint = wabInputUI.calculator.firstPoint; // will be removed from layer

    // remove content and tab
    wabInputUI.mainDiv.remove();
    this.tabDiv.querySelector(`div.modal-tab-item[target='${id}']`)?.remove();

    // remove from array
    this.wabInputsUi.splice(index, 1);
    this.wabInputsUiID.splice(index, 1);

    // onDestroyed(layer, firstPoint);
    firstPoint?.destroy(true);
    // let fp = firstPoint;
    // while (fp) {
    //   fp.dot?.kshape?.destroy();
    //   fp.line?.kline?.destroy()
    //   fp = fp.nextPoint
    //   if (fp === firstPoint) break;
    // }
    // top.fp = firstPoint
    // top.ly = layer
    // top.ui = wabInputUI
    // firstPoint?.dot?.kshape?.destroy();
  }

  ShowModal(state: boolean | null) {
    if (state === null) {
      show(2, this.containerDiv);
    } else {
      show(state ? 1 : 0, this.containerDiv);
    }
  }

  MakeExample(data: Array<weight>) {
    // make wab inpu ui in modal
    const wabInputUi = this.AddWabInputUI("Example", {
      strokeColor: "#008e28ff",
      strokeWidth: DefConfig.line.strokeWidth,
      lineCap: DefConfig.line.lineCap
    });
    wabInputUi.ImportData(data);
    // draw to chart
    wabInputUi.DrawToCalc(data);
    // // destroy
    // const firstPoint = wabInputUi.calculator.firstPoint;
    // firstPoint?.destroy(true);

  }
}