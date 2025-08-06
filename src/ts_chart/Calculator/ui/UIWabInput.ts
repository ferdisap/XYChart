import { Axis } from "../../Axis";
import { importSvg, objectGetKeyByValue, randStr } from "../../utils";
import { XYChart } from "../../XYChart";
import { add_item, create_weight_data, WabCalculator, weight } from "../wab_calculator";
import { AddDiv, CreateDomElement } from "./domutils"
import trashIcon from '../../../assets/delete-1487-svgrepo-com.svg?url';
import plusIcon from '../../../assets/add-svgrepo-com.svg?url';
import { TooltipWeb } from "../../Tooltip";

function setDataToForm(data: weight, id: string) {
  const name = data.name;
  const label = document.querySelector("#" + id + " label[name='" + name + "']")!;
  const weightSubContainer = label.parentElement!;
  // set weight value and unit, arm value, arm unit
  if (data.value) (weightSubContainer.querySelector(".wab-weight-input-container > input[name='weight-value']") as HTMLInputElement).value = data.value ? data.value.toFixed(3).toString() : '';
  if (data.unit) (weightSubContainer.querySelector(".wab-weight-input-container > select[name='weight-unit']") as HTMLInputElement).value = data.unit;
  if (data.arm.value) (weightSubContainer.querySelector(".wab-weight-input-container > input[name='arm-value']") as HTMLInputElement).value = data.arm.value ? data.arm.value.toFixed(3).toString() : '';
  if (data.arm.unit) (weightSubContainer.querySelector(".wab-weight-input-container > select[name='arm-unit']") as HTMLInputElement).value = data.arm.unit
  // set additional item
  if (this && data.additional_items) {
    const container = label.closest(".wab-weight-container")!;
    // const hasSummed = (container as HTMLElement).dataset["prevData"] ? true : false;
    // if(hasSummed) (container as HTMLElement).dataset["prevData"] = JSON.stringify(additonalWeightData);
    for (let i = 0; i < data.additional_items!.length; i++) {
      const additionalItemWeight = data.additional_items![i];
      const weightEl = (this as UIWabInput).AddWeightItem(container as HTMLDivElement)!;
      (weightEl.nameEl instanceof HTMLInputElement) ? (weightEl.nameEl.value = additionalItemWeight.name) : ((weightEl.nameEl as HTMLLabelElement).innerHTML = additionalItemWeight.name); // untuk label ga ada input nameEl
      weightEl.valueEl.value = additionalItemWeight.value ? additionalItemWeight.value.toFixed(3).toString() : '';
      weightEl.unitEl.value = additionalItemWeight.unit;
      weightEl.arm.valueEl.value = additionalItemWeight.arm.value ? additionalItemWeight.arm.value.toFixed(3).toString() : '';
      weightEl.arm.unitEl.value = additionalItemWeight.arm.unit;

      if (additionalItemWeight.hasSummed) {
        (weightEl.valueEl.closest(".wab-additional-weight-input-container")! as HTMLElement).dataset["prevData"] = JSON.stringify(additionalItemWeight);
      }
    }
  }
}

function getWeightData(element: HTMLElement): weight | null {
  const weightSubContainer = element.closest(".wab-weight-container")?.querySelector(".wab-weight-sub-container")!;
  if (weightSubContainer) {
    const weightName = weightSubContainer.querySelector('label')?.getAttribute('name')!;
    const weightValue = (weightSubContainer.querySelector(".wab-weight-input-container > input[name='weight-value']") as HTMLInputElement).value;
    const weightUnit = (weightSubContainer.querySelector(".wab-weight-input-container > select[name='weight-unit']") as HTMLInputElement).value;
    const armValue = (weightSubContainer.querySelector(".wab-weight-input-container > input[name='arm-value']") as HTMLInputElement).value;
    const armUnit = (weightSubContainer.querySelector(".wab-weight-input-container > select[name='arm-unit']") as HTMLInputElement).value;
    const weightData = create_weight_data(weightName, parseFloat(weightValue), weightUnit, { value: parseFloat(armValue), unit: armUnit }, null);
    return weightData
  }
  return null;
}

function getAdditionalWeightData(element: HTMLElement): weight | null {
  const containerItemInput = element.closest(".wab-additional-weight-input-container")! as HTMLElement;
  const hasSummed = containerItemInput.dataset["prevData"] ? true : false;
  if (containerItemInput) {
    const name = (containerItemInput.querySelector("input[name='item-name']")! as HTMLInputElement).value;
    const additionalWeightValue = (containerItemInput.querySelector("input[name='weight-value']")! as HTMLInputElement).value
    const additionalWeightUnit = (containerItemInput.querySelector("select[name='weight-unit']")! as HTMLInputElement).value
    const additionalArmValue = (containerItemInput.querySelector("input[name='arm-value']")! as HTMLInputElement).value
    const additionalArmUnit = (containerItemInput.querySelector("select[name='arm-unit']")! as HTMLInputElement).value
    return create_weight_data(name, parseFloat(additionalWeightValue), additionalWeightUnit, { value: parseFloat(additionalArmValue), unit: additionalArmUnit }, hasSummed);
  }
  return null
}

function getAllAdditionalWeightData(element: HTMLElement): Array<weight> {
  const weightContainer = element.closest(".wab-weight-container");
  const additionalWeightContainers = [...weightContainer!.querySelectorAll(".wab-additional-weight-input-container")].map((container: Element) => {
    if (container) {
      const hasSummed = (container as HTMLElement).dataset["prevData"] ? true : false;
      const name = (container.querySelector("input[name='item-name']")! as HTMLInputElement).value;
      const additionalWeightValue = (container.querySelector("input[name='weight-value']")! as HTMLInputElement).value
      const additionalWeightUnit = (container.querySelector("select[name='weight-unit']")! as HTMLInputElement).value
      const additionalArmValue = (container.querySelector("input[name='arm-value']")! as HTMLInputElement).value
      const additionalArmUnit = (container.querySelector("select[name='arm-unit']")! as HTMLInputElement).value
      return create_weight_data(name, parseFloat(additionalWeightValue), additionalWeightUnit, { value: parseFloat(additionalArmValue), unit: additionalArmUnit }, hasSummed);
    }
    return null
  }).filter(v => v);
  return additionalWeightContainers as Array<weight>;
}

/**
 * 
 * @param weightContainer current weight data
 * @param data 
 */
function setToNextWeightList(weightContainer: HTMLElement, data:weight, id:string) {
  // get data on  this weight
  // console.log(id, weightContainer, weightContainer!.nextElementSibling)
  if(!(weightContainer)) console.trace(weightContainer);
  const nextWeightContainer = weightContainer!.nextElementSibling;
  // set data on the next weight label
  if (nextWeightContainer && nextWeightContainer.matches(".wab-weight-container")) {
    const label = nextWeightContainer.querySelector("label[name]")!;
    const nextName = label.getAttribute('name');
    data.name = nextName!;

    // before set, add all additional items to be added
    const additionalWeightDatas = getAllAdditionalWeightData(label as HTMLElement);
    for (let i = 0; i < additionalWeightDatas.length; i++) {
      const additionalWeightData = additionalWeightDatas[i];
      const newData = add_item(data, additionalWeightData);
      if (newData) {
        data = newData;
      }

    }
    setDataToForm(data, id);
  }
}

let tttt = 0
// set the next weight list if focus input changed
function onInputValueChanged(ev: Event | HTMLElement, id: string) {
  let target: HTMLElement | null = null;
  if (ev instanceof Event && (ev.target as HTMLInputElement).value) {
    target = (ev.target as HTMLElement);
  }
  else if (ev instanceof HTMLElement) {
    target = ev;
  }
  if (target) {
    clearTimeout(tttt);
    tttt = setTimeout(() => {
      let data = getWeightData(target)!;
      const weightContainer = target.closest(".wab-weight-container")!;
      setToNextWeightList(weightContainer as HTMLElement, data, id)
    }, 100)
  }
}

interface weightEl {
  nameEl: HTMLInputElement | HTMLLabelElement,
  valueEl: HTMLInputElement,
  unitEl: HTMLSelectElement,
  arm: {
    valueEl: HTMLInputElement,
    unitEl: HTMLSelectElement
  }
}

export class UIWabInput {

  mainDiv: HTMLElement;

  calculator: WabCalculator;
  chart: XYChart;
  macAxis: Axis;
  rightAxis: Axis; // currently unused
  indexUnitAxis: Axis;
  weightAxis: Axis;

  id: string;

  _title: HTMLDivElement;

  constructor(parentDiv: HTMLElement, calculator: WabCalculator, chart: XYChart, macAxis: Axis, rightAxis: Axis, indexUnitAxis: Axis, weightAxis: Axis) {
    this.id = randStr(5);

    this.chart = chart;
    this.macAxis = macAxis;
    this.rightAxis = rightAxis;
    this.indexUnitAxis = indexUnitAxis;
    this.weightAxis = weightAxis;
    this.calculator = calculator;

    this.mainDiv = AddDiv(parentDiv, 'wab-calc-main');
    this.mainDiv.setAttribute('id', this.id);
    parentDiv.style.position = 'relative';
    // this.stylingMain();

    this._title = AddDiv(this.mainDiv, 'wab-calc-title', '');

    // submit btn
    const buttonDiv = AddDiv(this.mainDiv, 'wab-calc-button-container', '');
    const submitbtn = CreateDomElement('button', 'wab-calc-button-submit', 'Submit');
    buttonDiv.appendChild(submitbtn);
    // download btn
    const downloadBtn = CreateDomElement('button', 'wab-calc-button-download', 'Donwload');
    buttonDiv.appendChild(downloadBtn);
    // import btn
    const importInput = CreateDomElement('input', 'wab-calc-input-import');
    const importButton = CreateDomElement('button', 'wab-calc-button-import', 'Import');
    importInput.setAttribute('type', 'file')
    importInput.style.display = 'none'
    importInput.setAttribute('accept', ".awb")
    buttonDiv.appendChild(importButton);
    buttonDiv.appendChild(importInput);

    // this.stylingSubmitButton(buttonDiv as HTMLDivElement);

    submitbtn.addEventListener('click', () => {
      const data = this.getData();
      // delete before redraw
      const firstPoint = this.calculator.firstPoint;
      firstPoint?.destroy(true)
      // redraw
      this.DrawToCalc(data);
    })
    downloadBtn.addEventListener('click', () => this.DownloadData())
    importButton.addEventListener('click', () => importInput.click())
    importInput.addEventListener('change', async (ev: Event) => {
      const file = (ev.target as HTMLInputElement).files!.item(0)!
      const weightData = JSON.parse(await file.text())
      this.ImportData(weightData);
      [...this.mainDiv.querySelectorAll(".wab-additional-weight-input-container")].forEach((additionalInpuContainer: Element) => {
        if ((additionalInpuContainer as HTMLElement).dataset["prevData"]) {
          (additionalInpuContainer as HTMLElement).querySelector(".additional-item-sum-btn")?.classList.add('summed');
        }
      })
    })

    // add weight form to display
    this.AddWeight(weight.MEW);
    this.AddWeight(weight.BEW);
    this.AddWeight(weight.OEW);
    this.AddWeight(weight.ZFW);
    this.AddWeight(weight.TOW);

    // create conversion UI
    // const conversionIndexUnitToCgArm = AddDiv(this.mainDiv, 'wab-calc-button-container', '');
    this.createConversion_IndexUnit_To_Cgarm();
  }

  set title(name: string) {
    this._title.textContent = name;
  }

  get title() {
    return this._title.textContent;
  }

  AddWeight(weightType: number): weightEl | null {
    const name = objectGetKeyByValue(weight, weightType);
    if (!name) return null;
    const container = AddDiv(this.mainDiv, 'wab-weight-container');

    const subcontainer = AddDiv(container, 'wab-weight-sub-container');

    const onInputChanged = (ev: Event) => onInputValueChanged(ev, this.id);

    // create label
    const label = this.createLabel(name);
    subcontainer.appendChild(label)
    // input weight
    const inputValue = this.createWeightInputValue(onInputChanged);
    // unit weight
    const weightUnit = this.createWeightUnit(onInputChanged);
    // input arm
    const inputArm = this.createInputArm(onInputChanged);
    // unit arm
    const armUnit = this.createArmUnit(onInputChanged)
    // addButton weight item
    const button = CreateDomElement('button', 'add-item-btn', '+');
    button.addEventListener('click', (ev: MouseEvent) => this.AddWeightItem((ev.target as HTMLElement)!.closest(".wab-weight-container")!))
    // append to container
    const containerInput = AddDiv(subcontainer, 'wab-weight-input-container');

    containerInput.appendChild(inputValue);
    containerInput.appendChild(weightUnit);
    containerInput.appendChild(inputArm);
    containerInput.appendChild(armUnit);
    containerInput.appendChild(button);

    return {
      nameEl: label as HTMLLabelElement,
      valueEl: inputValue as HTMLInputElement,
      unitEl: weightUnit as HTMLSelectElement,
      arm: {
        valueEl: inputArm as HTMLInputElement,
        unitEl: armUnit as HTMLSelectElement
      }
    }
  }

  AddWeightItem(weightContainer: HTMLDivElement): weightEl {
    const containerItemInput = AddDiv(weightContainer, 'wab-additional-weight-input-container');

    // button sum
    const sumbutton = CreateDomElement('button', 'additional-item-sum-btn', importSvg(plusIcon))
    new TooltipWeb(sumbutton as HTMLDivElement, () => {}, "Sum to main weight")
    sumbutton.addEventListener('click', (ev: MouseEvent) => {
      const prevDataSaved = containerItemInput.dataset["prevData"] ? JSON.parse(containerItemInput.dataset["prevData"]) : null;
      // this.sumItemToWeight((ev.target as HTMLElement).closest(".wab-additional-weight-input-container") as HTMLDivElement, prevDataSaved, (additonalWeightData) => {
      this.sumItemToWeight(containerItemInput as HTMLDivElement, prevDataSaved, (additonalWeightData) => {
        onInputValueChanged(containerItemInput, this.id);
        containerItemInput.dataset["prevData"] = JSON.stringify(additonalWeightData);
      });
      sumbutton.classList.add('summed');
    });

    const delbutton = CreateDomElement('button', 'additional-item-del-btn', importSvg(trashIcon))
    new TooltipWeb(delbutton as HTMLDivElement, () => {}, "delete this item weight from main")
    delbutton.addEventListener('click', (ev: MouseEvent) => {
      const prevDataSaved = containerItemInput.dataset["prevData"] ? JSON.parse(containerItemInput.dataset["prevData"]) : null;
      this.delItemToWeight(containerItemInput as HTMLDivElement, prevDataSaved, () => {
        // delete the container here
        containerItemInput.remove();
      })
    })

    const onInputChanged = () => {
      sumbutton.classList.remove('summed');
    }

    // name item
    const nameInput = this.createAdditonalItemNameInput(onInputChanged) as HTMLInputElement;
    // weight value
    const inputValue = this.createWeightInputValue(onInputChanged);
    // unit weight
    const weightUnit = this.createWeightUnit(onInputChanged);
    // input arm
    const inputArm = this.createInputArm(onInputChanged);
    // unit arm
    const armUnit = this.createArmUnit(onInputChanged)

    containerItemInput.appendChild(nameInput);
    containerItemInput.appendChild(inputValue);
    containerItemInput.appendChild(weightUnit);
    containerItemInput.appendChild(inputArm);
    containerItemInput.appendChild(armUnit);
    containerItemInput.appendChild(sumbutton);
    containerItemInput.appendChild(delbutton);

    return {
      nameEl: nameInput as HTMLInputElement,
      valueEl: inputValue as HTMLInputElement,
      unitEl: weightUnit as HTMLSelectElement,
      arm: {
        valueEl: inputArm as HTMLInputElement,
        unitEl: armUnit as HTMLSelectElement
      }
    }
  }

  DownloadData() {
    const jsonString = JSON.stringify(this.getData());
    const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);

    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('download', "wab_calc_" + Date.now() + '.awb'); // Add .json extension
    document.body.appendChild(anchor); // Append to body (required for Firefox)
    anchor.click();
    document.body.removeChild(anchor); // Remove after click
  }

  ImportData(datas: Array<weight>) {
    for (let i = 0; i < datas.length; i++) {
      const weightData = datas[i];
      (setDataToForm.bind(this))(weightData, this.id);
    }
  }

  DrawToCalc(datas: Array<weight>) {
    for (let i = 0; i < datas.length; i++) {
      const weightData = datas[i];
      switch (weightData.name) {
        case 'MEW': this.calculator.SetWeight(weightData, weight.MEW); break;
        case 'BEW': this.calculator.SetWeight(weightData, weight.BEW); break;
        case 'OEW': this.calculator.SetWeight(weightData, weight.OEW); break;
        case 'ZFW': this.calculator.SetWeight(weightData, weight.ZFW); break;
        case 'TOW': this.calculator.SetWeight(weightData, weight.TOW); break;
        default: break;
      }
    }
    this.calculator.DrawToChart(this.chart, this.weightAxis, this.indexUnitAxis, this.macAxis);
  }

  private getData(): Array<weight> {
    let weights: Array<Element | weight> = [...this.mainDiv.querySelectorAll(".wab-weight-sub-container")];
    return weights.map((weightSubContainer: Element | weight) => {
      let name = (weightSubContainer as Element).querySelector("#" + this.id + ' label[name]')!.getAttribute('name')!;
      let inputWeight = (weightSubContainer as Element).querySelector("#" + this.id + " input[name='weight-value']") as HTMLInputElement;
      let weightUnit = (weightSubContainer as Element).querySelector("#" + this.id + " select[name='weight-unit']") as HTMLSelectElement;
      let inputArm = (weightSubContainer as Element).querySelector("#" + this.id + " input[name='arm-value']") as HTMLInputElement;
      let armUnit = (weightSubContainer as Element).querySelector("#" + this.id + " select[name='arm-unit']") as HTMLSelectElement;
      const data = create_weight_data(name, parseFloat(inputWeight.value), weightUnit.value, { value: parseFloat(inputArm.value), unit: armUnit.value }, null);

      // add items to data
      let additionalItems = [...(weightSubContainer as Element).parentElement!.querySelectorAll(".wab-additional-weight-input-container")].map((additionalWeightInputContainer: Element) => {
        return getAdditionalWeightData(additionalWeightInputContainer as HTMLElement);
      })

      data.additional_items = additionalItems as Array<weight>
      return data
    })
  }

  private sumItemToWeight(additionalWeightInputContainer: HTMLDivElement, prevDataSaved: weight | null, onSummed: Function | null) {
    // additonal weight data
    const additionalWeightData = getAdditionalWeightData(additionalWeightInputContainer);
    // weight data
    let weightData = getWeightData(additionalWeightInputContainer);
    // before add item, ensure minuse the prevData saved here
    if (prevDataSaved) {
      weightData = add_item(weightData!, prevDataSaved, false)
    }
    let newData = add_item(weightData!, additionalWeightData!);
    if (newData) {
      setDataToForm(newData, this.id);
      // next weight container is set via callaback onSummed because there is delay timeout
      if (onSummed) onSummed(additionalWeightData);
    }
  }

  private delItemToWeight(additionalWeightInputContainer: HTMLDivElement, prevDataSaved: weight | null, onDeleted: Function) {
    // sum prior to delete
    this.sumItemToWeight(additionalWeightInputContainer, prevDataSaved, null)
    // additonal weight data
    const additionalWeightData = getAdditionalWeightData(additionalWeightInputContainer);
    // weight data
    let weightData = getWeightData(additionalWeightInputContainer);
    // no need to minus prev data like sumItemWeight
    // then kurangin main weight data main terhadap additional item yang akan dihapus ini
    let newData = add_item(weightData!, additionalWeightData!, false);
    if (newData) {
      setDataToForm(newData, this.id);
      const weightContainer = additionalWeightInputContainer.closest(".wab-weight-container")!;
      setToNextWeightList(weightContainer as HTMLElement, newData, this.id)
      if (onDeleted) onDeleted(additionalWeightData);
    }
  }

  // styling label
  private createLabel(name: string) {
    const label = CreateDomElement('label', 'wab-weight-label', name);
    label.setAttribute('name', name);
    return label;
  }

  // stlyling add weight item button
  // private stylingAddButtonWeightItem(button: HTMLButtonElement) {
  // button.style.margin = '0 0 0 5px';
  // }

  // styling input weight
  private createWeightInputValue(onChanged: Function) {
    const input = CreateDomElement('input', 'wab-weight-input-value weight-value', '');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'weight value');
    input.setAttribute('name', "weight-value");
    input.addEventListener('change', onChanged as EventListenerOrEventListenerObject)
    return input
  }

  // styling weight unit
  private createWeightUnit(onChanged: Function) {
    const weightUnit = CreateDomElement('select', 'wab-weight-select-unit');
    weightUnit.setAttribute('name', 'weight-unit')
    const optionWeight = CreateDomElement('option', '', 'kg');
    optionWeight.setAttribute('value', 'kg')
    weightUnit.appendChild(optionWeight);
    weightUnit.addEventListener('change', onChanged as EventListenerOrEventListenerObject)
    return weightUnit
  }

  // styling input arm
  private createInputArm(onChanged: Function) {
    const inputArm = CreateDomElement('input', 'wab-arm-input-value arm-value', '');
    inputArm.setAttribute('type', 'text');
    inputArm.setAttribute('placeholder', 'arm value');
    inputArm.setAttribute('name', "arm-value");
    inputArm.addEventListener('change', onChanged as EventListenerOrEventListenerObject)
    return inputArm
  }

  // styling arm unit
  private createArmUnit(onChanged: Function) {
    const armUnit = CreateDomElement('select', 'wab-arm-select-unit');
    armUnit.setAttribute('name', 'arm-unit')
    const optionArm = CreateDomElement('option', '', 'm');
    optionArm.setAttribute('value', 'm')
    armUnit.appendChild(optionArm);
    optionArm.addEventListener('change', onChanged as EventListenerOrEventListenerObject)
    return armUnit;
  }

  private createAdditonalItemNameInput(onChanged: Function) {
    const input = CreateDomElement('input', 'input-name');
    input.setAttribute('placeholder', 'name')
    input.setAttribute('name', 'item-name')
    input.addEventListener('change', onChanged as EventListenerOrEventListenerObject)
    return input
  }

  private createConversion_IndexUnit_To_Cgarm() {
    const container = AddDiv(this.mainDiv, 'wab-conversion-container')
    AddDiv(container, '', "Conversion")

    const weightinput = CreateDomElement('input', 'wab-weight-input-value', '') as HTMLInputElement;
    weightinput.setAttribute('type', 'text');
    weightinput.setAttribute('placeholder', 'weight in kg');
    weightinput.setAttribute('name', "weight-value");

    container.appendChild(weightinput);

    const indexUnitInput = CreateDomElement('input', 'wab-indexunit-input-value', '') as HTMLInputElement;
    indexUnitInput.setAttribute('type', 'text');
    indexUnitInput.setAttribute('placeholder', 'index unit in kgm');
    indexUnitInput.setAttribute('name', "indexunit-value");

    container.appendChild(indexUnitInput);

    const cgarmInput = CreateDomElement('input', 'wab-arm-input-value', '') as HTMLInputElement;
    cgarmInput.setAttribute('type', 'text');
    cgarmInput.setAttribute('placeholder', 'arm in m');
    cgarmInput.setAttribute('name', "arm-value");

    container.appendChild(cgarmInput);

    weightinput.addEventListener('change', () => {
      if (weightinput.value) {
        if (indexUnitInput.value) {
          cgarmInput.value = (this.calculator.Convert_To_Arm(Number(indexUnitInput.value), Number(weightinput.value)) as number).toFixed(3).toString();
        }
        else if (cgarmInput.value) {
          const mac = this.calculator.Convert_To_Mac(Number(cgarmInput.value)) as number;
          indexUnitInput.value = (this.calculator.Convert_To_IndexUnit(mac, Number(weightinput.value)) as number).toFixed(3).toString();
        }
      }
    })

    indexUnitInput.addEventListener('change', () => {
      if (indexUnitInput.value) {
        if (weightinput.value) {
          cgarmInput.value = (this.calculator.Convert_To_Arm(Number(indexUnitInput.value), Number(weightinput.value)) as number).toFixed(3).toString();
        }
        else if (cgarmInput.value) {
          weightinput.value = (this.calculator.Convert_To_Weight(Number(indexUnitInput.value), Number(cgarmInput.value)) as number).toFixed(3).toString();
        }
      }
    })

    cgarmInput.addEventListener('change', () => {
      if (cgarmInput.value) {
        if (weightinput.value) {
          const mac = this.calculator.Convert_To_Mac(Number(cgarmInput.value)) as number;
          indexUnitInput.value = (this.calculator.Convert_To_IndexUnit(mac, Number(weightinput.value)) as number).toFixed(3).toString();
        }
        else if (weightinput.value) {
          const mac = this.calculator.Convert_To_Mac(Number(cgarmInput.value)) as number;
          indexUnitInput.value = (this.calculator.Convert_To_IndexUnit(mac, Number(weightinput.value)) as number).toFixed(3).toString();
        }
      }
    })
  }
}
