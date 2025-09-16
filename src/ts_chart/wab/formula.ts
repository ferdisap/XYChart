import { formulaType } from "../Config";

export function getFormulaFn(type:number) :Function | null{
  switch (type) {
    case formulaType.indexUnit_CN235: return formula_index_unit_cn_235;
    case formulaType.indexUnit_C212: return formula_index_unit_c212;
  }
  return null
}

export function formula_mac_cn_235(cgarm:number):number{
  // return const cgarm = ((mac / 100) * 2.604) + 9.5678;
  return ((cgarm - 9.5678)/2.604)*100;
}

export function formula_mac_c_212(cgarm:number):number{
  return ((cgarm - 5.462)/2.190)*100;
}

export function formula_index_unit_cn_235(mac: number, weight: number) :number{
  // console.log(mac, weight)
  // const indexUnit = weight * (((((mac * 2.604) / 100) + 9.5678) / weight) - 10.219)
  const cgarm = ((mac / 100) * 2.604) + 9.5678;
  const indexArm = cgarm - 10.219;
  const indexUnit = indexArm * weight;
  return indexUnit;
}

export function formula_index_unit_c212(mac: number, weight: number) :number{
  const cgarm = ((mac / 100) * 2.190) + 5.462;
  const indexArm = cgarm - 5.898; // 5.898 adalah index unit
  const indexUnit = indexArm * weight;
  return indexUnit;
}

// export function formula_max_cn_235(cgarm:number) :number{
//   return ((cgarm - 9.5678)/2.604)*100;
// }
// export function formula_max_c_212(cgarm:number) :number{
//   return ((cgarm - 5.462)/2.190)*100;
// }

export function formula_cgarm_from_IndexUnit(indexUnit:number, weight:number){
  const indexArm = indexUnit / weight;
  const cgarm = indexArm + indexUnit;
  return cgarm;
}