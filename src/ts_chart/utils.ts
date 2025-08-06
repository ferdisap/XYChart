import { align as alignType, coord, dimension, font } from './Config'
import { position as positionType } from './Config'
import { Point } from './Point';

export function getWidthOfText(text: string, fontsize: number, fontFamily: string, fontWeight: string): number {
  const texts = text.split('\n');
  let mostLengths: number = 0;
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = fontWeight + ' ' + fontsize + 'px ' + fontFamily;
    //  'bold 16px Arial'; // Example: adjust as needed
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    if (textWidth > mostLengths) mostLengths = textWidth;
  }
  return mostLengths;
}

export function getAdditionValueByAlign(align: number, heightText: number, widthText: number, additionalRotationDimension: dimension = { width: 0, height: 0 }): dimension {
  // console.log(align)
  let xAdditionalPos: number = 0;
  let yAdditionalPos: number = 0;
  switch (align) {
    case alignType.left:
      xAdditionalPos = 0;
      // yAdditionalPos += additionalRotationDimension.height
      break;
    case alignType.center:
      xAdditionalPos = -(widthText / 2);
      // yAdditionalPos += additionalRotationDimension.height / 2
      yAdditionalPos += ((-heightText) / 2)
      break;
    case alignType.right:
      xAdditionalPos = -(widthText);
      // yAdditionalPos += additionalRotationDimension.height
      break;
  }
  xAdditionalPos += additionalRotationDimension.width
  return {
    width: xAdditionalPos,
    height: yAdditionalPos
  };
}

export function getAdditionValueByRotate(rotate: number | null | undefined, widthText: number): dimension {
  if (!rotate || rotate === 0) {
    return { width: 0, height: 0 }
  };
  const additionalHeight = Math.abs(Math.tan(rotate) * widthText);
  const additionalWidth = Math.abs(Math.cos(rotate) * widthText);
  return {
    width: -additionalWidth,
    height: additionalHeight
  }
}

/**
example object
const alignType = {
  "left": 1,
  "center":2,
  "right":3,
}
 */
export function objectGetKeyByValue(object: any, value: any): any {
  return Object.keys(object).find(key => object[key] === value);
}


/**
* to define where the text is placed towards the point/coord (x,y)
* @param position position of label from the node x,y
* @param align is wheter the text is left, center or right
* @param widthText 
* @param heightText 
* @param x is reference target position in x axis
* @param y is reference target position in y axis
* @returns 
*/
export function defineLabelPosition(position: number, style: font, spaceWidth: number, x: number, y: number): coord | null {
  if (!style.align) {
    console.error('there is no align of the text.')
    console.trace();
    return null;
  }

  let xpos: number = x; // x = reference target position in x axis
  let ypos: number = y; // y = reference target position in y axis

  let AdditionalValueByRotate = getAdditionValueByRotate(style.rotate, spaceWidth);
  let AdditionalValueByAlign = getAdditionValueByAlign(alignType[style.align], style.size, spaceWidth, AdditionalValueByRotate);
  let xAdditionalValueByAlign = AdditionalValueByAlign.width;
  // let yAdditionalValueByAlign = AdditionalValueByAlign.height
  const marginX = 10;
  const marginY = 10;

  switch (position) {
    case positionType.top:
      xpos = x + xAdditionalValueByAlign;
      ypos = y - style.size - marginY;
      ypos = y - style.size - marginY;
      break;
    case positionType.right:
      xpos = x + (xAdditionalValueByAlign * 2) + spaceWidth + marginX;
      ypos -= (style.size / 2);
      break;
    case positionType.bottom:
      xpos = x + xAdditionalValueByAlign;
      ypos = y + style.size;
      break;
    case positionType.left:
      xpos = x + xAdditionalValueByAlign - spaceWidth - marginX;
      ypos -= (style.size / 2);
      break;
    default:
      return null;
  }
  ypos += AdditionalValueByRotate.height / 2
  return new Point(xpos, ypos, null);
}

/**
 * to define where the text is placed toward the twi point/coord
 * @param position 
 * @param style 
 * @param spaceWidth 
 * @param point1 
 * @param point2 
 * @returns 
 */
export function defineTextPosition(position: number, style: font, spaceWidth: number, point1: Point | coord, point2: Point | coord): coord {
  let lengthX: number, lengthY: number, xpos: number, ypos: number;

  if ((point2.x - point1.x === 0)) {
    lengthX = point2.x
    xpos = lengthX;
  } else {
    lengthX = point2.x - point1.x;
    xpos = lengthX / 2;
  }

  if ((point2.y - point1.y === 0)) {
    lengthY = point2.y
    ypos = lengthY
  } else {
    lengthY = point2.y - point1.y;
    ypos = lengthY / 2;
  }
  // const lengthX = (point2.x - point1.x === 0) ? point2.x : (point2.x - point1.x);
  // const lengthY = (point2.y - point1.y === 0) ? point2.y : (point2.y - point1.y);

  // let xpos: number = lengthX / 2;
  // let ypos: number = lengthY / 2;

  let AdditionalValueByRotate = getAdditionValueByRotate(style.rotate, spaceWidth);
  let AdditionalValueByAlign = getAdditionValueByAlign(alignType[style.align!], style.size, spaceWidth, AdditionalValueByRotate);

  // console.log(style.rotate, AdditionalValueByRotate)

  xpos += AdditionalValueByAlign.width;
  ypos += AdditionalValueByAlign.height;
  switch (position) {
    case positionType.top:
      ypos -= style.size + AdditionalValueByRotate.width;
      break;
    case positionType.right:
      xpos += spaceWidth + AdditionalValueByRotate.width;
      break;
    case positionType.bottom:
      ypos += style.size + AdditionalValueByRotate.width;
      break;
    case positionType.left:
      xpos -= spaceWidth + AdditionalValueByRotate.width;
      break;
  }
  return {
    x: xpos,
    y: ypos
  }
}

/**
 * const p1x = (3 / 150);
 * const p2x = (22 / 150) - p1x;
 * const p3x = (46 / 150) - p2x - p1x;
 * const p4x = (79 / 150) - p3x - p2x - p1x;
 * const p5x = (110 / 150) - p4x - p3x - p2x - p1x;
 * const p6x = (141 / 150) - p5x - p4x - p3x - p2x - p1x;
 */
export function create_x_ratio_end_to_end(ratios: Array<number>): Array<number> {
  let prevTotalRatio = 0;
  let endToEndRatio: Array<number> = [];
  for (let i = 0; i < ratios.length; i++) {
    const ratio = ratios[i] - prevTotalRatio;
    prevTotalRatio += ratio;
    endToEndRatio.push(ratio);
  }
  endToEndRatio.unshift(0)
  return endToEndRatio;
}

/**
 * generate misal dari -500 ke 500 dengan range 100 maka hasilnya [-500,-40,-300,-200,-100,0,100,200,300,400,500]
 * @param number1 
 * @param range 
 * @param per 
 * @returns 
 */
export function spread_number_to_range(number1: number, range: number, per: number) {
  const ranges: Array<number> = [];
  for (let i = 0; i < per; i++) {
    ranges.push(number1 + (range * i));
  }
  return ranges;
}

/**
 * misal angka 100, dan per 5 bagian maka hasilnya [20, 40, 60, 80, 100]
 * @param no 
 * @param per 
 * @returns 
 */
export function spread_number(no: number, per: number): Array<number> {
  const factor = no / per;
  const numbers: Array<number> = [];
  for (let n = 1; n <= per; n++) {
    const label = (n * factor);
    numbers.push(label)
  }
  return numbers;
}

export function randStr(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function importSvg(svg: string) {
  return decodeURIComponent(svg).substring("data:image/svg+xml,".length)
}


export function show(state: number, element: HTMLElement) {
  if (state === 0) {
    // set to hide
    const savedDisplay: string = element.style.display ? element.style.display : getComputedStyle(element).display;
    if (savedDisplay !== 'none') element.dataset['prevDisplay'] = savedDisplay;
    element.style.display = 'none';
  }
  else if (state === 1) {
    // set to show
    const prevDisplay: string = element.dataset["prevDisplay"] ? element.dataset["prevDisplay"] : '';
    if (prevDisplay || typeof prevDisplay === 'string') {
      if (prevDisplay !== 'none') {
        element.style.display = prevDisplay
      }
    }
    element.dataset['prevDisplay'] = 'none';
  }
  else if (state === 2) {
    // set to inverse
    const prevDisplay: string = element.dataset["prevDisplay"] ? element.dataset["prevDisplay"] : element.style.display;
    const currDisplay: string = getComputedStyle(element).display;
    if (currDisplay === 'none') {
      element.style.display = prevDisplay;
      element.dataset['prevDisplay'] = 'none';
    } else {
      element.style.display = 'none';
      element.dataset['prevDisplay'] = currDisplay;
    }
  }
}

export function getTanDegree(depan: number, samping: number) {
  const degree = Math.atan(depan / samping) * 180 / Math.PI;
  return degree;
}

/**
 * untuk memecah array menjadi aray inside berdasarkan chunksize. Misal [1,2,3,4] menjadi [[1,2],[3,4]]
 * @param arr 
 * @param chunkSize 
 * @returns 
 */
export function chunkArray(arr:Array<any>, chunkSize:number):Array<Array<any>>{
  const result:any = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}