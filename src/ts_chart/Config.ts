export interface coord {
  x: number,
  y: number,
}

export const formulaType = {
  'indexUnit_CN235': 1,
}

export interface position {
  "top"?: number,
  "right"?: number,
  "bottom"?: number,
  "left"?: number,
}

export const position = {
  "top": 1,
  "right": 2,
  "bottom": 3,
  "left": 4,
}

export const align = {
  "left": 1,
  "center": 2,
  "right": 3,
}

export interface lineCap {
  "butt"?: number,
  "round"?: number,
  "square"?: number,
}

export const lineCap = {
  "butt": 1,
  "round": 2,
  "square": 3
}

export const pointType = {
  "circle": 1,
  "rectangle": 2,
}

export interface container {
  id: string,
  element?: HTMLElement,
  paddingTop: number,
  paddingLeft: number,
  paddingBottom: number,
  paddingRight: number,
  dimension: dimension
}

export interface dimension {
  width: number,
  height: number,
}

export interface font {
  size: number,
  weight: string,
  family: string,
  align?: number,
  rotate?: number,
}

export interface line {
  strokeColor: string,
  strokeWidth: number,
  lineCap: number
}

export interface area {
  strokeColor: string,
  strokeWidth: number,
  lineCap: number
  fill: string,
  opacity: number,
}

export interface point {
  type: number,
  radius: number,
  fill: string,
  name?: string,
  value?: number,
  unit?:string,
  rotate?:number, // default
  // strokeColor: "string",
  // strokeWidth: number
}

export interface ConfigChart {
  formulaType?: number,

  // canvas config
  container: container,

  // container config
  // dimension: dimension,

  // font config
  font: font

  // line config
  line: line

  // area config
  area?: area,

  // point
  point: point
}

// function tes(params: ConfigChart) {}

export const DefConfig = {
  container: {
    id: '',
    paddingTop: 20,
    paddingBottom: 120,
    paddingLeft: 60,
    paddingRight: 100,
    dimension: {
      width: 800,
      height: 600,
    }
  },
  font: {
    size: 14,
    weight: '',
    family: 'Calibri'
  },
  line: {
    strokeColor: '#000000',
    strokeWidth: 2,
    lineCap: lineCap.round
  },
  area: {
    fill: "#41e741",
    opacity: 0.5,
    strokeColor: '#000000',
    strokeWidth: 2,
    lineCap: lineCap.round
  },
  point: {
    type: pointType.circle,
    fill: 'red',
    radius: 5
  }
}

export function getLineConfig(strokeColor: string | null, strokeWidth: number | null, lineCap: number | null): line {
  return {
    strokeColor: strokeColor ? strokeColor : DefConfig.line.strokeColor,
    strokeWidth: strokeWidth ? strokeWidth : DefConfig.line.strokeWidth,
    lineCap: lineCap ? lineCap : DefConfig.line.lineCap,
  }
}