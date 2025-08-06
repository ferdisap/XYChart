import { Text } from "konva/lib/shapes/Text";
import { Point } from "./Point";
import Konva from "konva";
import { align, font } from "./Config";
import { getWidthOfText, objectGetKeyByValue, show } from "./utils";
import { Rect } from "konva/lib/shapes/Rect";
import { Layer } from "konva/lib/Layer";
import { handleDoubleClick } from "./eventHandler/dblClick";
import { AddDiv, CreateDomElement } from "./Calculator/ui/domutils";

// tooltip chart
export class Tooltip {
  text: Text;
  rect: Rect;

  _isInstalled: boolean;
  _isShowed: boolean;

  constructor(point: Point, text: string, config: font) {
    const padding = 5;
    const width = getWidthOfText(text, config.size, config.family, config.weight) + (padding * 2);

    // jika mau enter tambahkan \n\n
    // COMPLEX TEXT\n\nAll the world's a stage, and all the men and women merely players. They have their exits and their entrances.
    this.text = new Konva.Text({
      x: point.x,
      y: point.y,
      text: text,
      fontSize: config.size,
      fontFamily: config.family,
      fill: '#555',
      align: objectGetKeyByValue(align, config.align),
      width: width,
      padding: padding,
    })

    this.rect = new Konva.Rect({
      x: point.x,
      y: point.y,
      stroke: '#555',
      strokeWidth: 2,
      fill: '#ddd',
      width: width,
      height: this.text.height(),
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      shadowOpacity: 0.2,
      cornerRadius: 3
    })

    handleDoubleClick(this.text, () => this.Show(false), null)
  }

  isInstalled(): boolean {
    return this._isInstalled;
  }

  isShowed(): boolean {
    return this._isShowed;
  }

  Install(layer: Layer) {
    layer.add(this.rect)
    layer.add(this.text);
    this._isInstalled = true;
  }

  Uninstall() {
    this.rect.remove();
    this.text.remove();
    this._isInstalled = false;
  }

  Show(state: boolean) {
    if (state) {
      this.rect.show();
      this.text.show();
      this._isShowed = true;
    } else {
      this.text.hide();
      this.rect.hide();
      this._isShowed = false;
    }
  }
}
export class TooltipWeb {
  trigger: HTMLElement;
  target: HTMLElement;

  constructor(trigger: HTMLDivElement, onClick:Function, text:string|null = null) {
    this.trigger = trigger
    this.trigger.classList.add('wab-tooltipweb-trigger');
    this.target = AddDiv(this.trigger, 'wab-tooltipweb-target', text ? text : this.trigger.getAttribute('alt')!);
    this.trigger.prepend(this.target);
    show(0, this.target)

    this.addMouseoverEvent();
    this.addOnClickEvent(onClick);
  }

  createTarget(inner: string | HTMLElement | null): HTMLElement {
    const targetContainerDiv = CreateDomElement('div', '', (typeof inner === 'string' ? inner : (!inner ? '' : inner.outerHTML)));
    // InsertDomElementBefore(targetContainerDiv, this.trigger);
    this.trigger.prepend(targetContainerDiv);
    return targetContainerDiv;
  }

  addMouseoverEvent() {
    this.trigger.addEventListener('mouseover', () => show(1, this.target));
    this.trigger.addEventListener('mouseout', () => show(0, this.target));
  }

  addOnClickEvent(onClick:Function){
    this.trigger.addEventListener('click', onClick as EventListenerOrEventListenerObject)
  }
}