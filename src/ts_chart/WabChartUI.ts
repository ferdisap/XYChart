import { AddButton, AddDiv, CreateDomElement } from "./Calculator/ui/domutils";
import modalShowHideBtn from '../../assets/settings-gear-svgrepo-com.svg?url'
import { importSvg, randStr } from "./utils";
import { TooltipWeb } from "./Tooltip";
import { Modal } from "./Calculator/ui/Modal";
import { XYChart } from "./XYChart";
import { Axis } from "./Axis";
import { ConfigChart, DefConfig } from "./Config";

import indexCss from '../css/index.css?url';

export class WabChartUI {
  toolbarDiv: HTMLDivElement;
  contentDiv:HTMLDivElement

  _modal: Modal | null
  config: ConfigChart;

  constructor(parentDiv: HTMLDivElement) {
    parentDiv.classList.add('wab');
    this.toolbarDiv = AddDiv(parentDiv, "wab-toolbar");
    this.toolbarDiv.id = randStr(5);
    this.contentDiv = AddDiv(parentDiv, "wab-content");
    this.contentDiv.id = randStr(5);

    this._modal = null;
    this.config = DefConfig

    const link = CreateDomElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', indexCss);

    parentDiv.appendChild(link)
  }

  Init(){
  }
}