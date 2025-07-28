// import { GangMemberInfo } from 'NetscriptDefinitions'



function readyToAscend1(ns: NS, member: GangMemberInfo, mult_gain_factor: number): boolean {
  let agi_points_gain = (member.agi_asc_points + ns.formulas.gang.ascensionPointsGain(member.agi_exp))
  let agi_mult_gain_factor = ns.formulas.gang.ascensionMultiplier(agi_points_gain) / member.agi_asc_mult
  let condition1 = agi_mult_gain_factor > mult_gain_factor
  let str_points_gain = (member.str_asc_points + ns.formulas.gang.ascensionPointsGain(member.str_exp))
  let str_mult_gain_factor = ns.formulas.gang.ascensionMultiplier(str_points_gain) / member.str_asc_mult
  let condition2 = str_mult_gain_factor > mult_gain_factor
  let dex_points_gain = (member.dex_asc_points + ns.formulas.gang.ascensionPointsGain(member.dex_exp))
  let dex_mult_gain_factor = ns.formulas.gang.ascensionMultiplier(dex_points_gain) / member.dex_asc_mult
  let condition3 = dex_mult_gain_factor > mult_gain_factor
  let def_points_gain = (member.def_asc_points + ns.formulas.gang.ascensionPointsGain(member.def_exp))
  let def_mult_gain_factor = ns.formulas.gang.ascensionMultiplier(def_points_gain) / member.def_asc_mult
  let condition4 = def_mult_gain_factor > mult_gain_factor
  return condition1 || condition2 || condition3 || condition4
}
function readyToAscend2(ns: NS, member: GangMemberInfo, points_gain_total: number): boolean {
  let agi_points_gain = (ns.formulas.gang.ascensionPointsGain(member.agi_exp))
  let condition1 = agi_points_gain > points_gain_total
  let str_points_gain = (ns.formulas.gang.ascensionPointsGain(member.str_exp))
  let condition2 = agi_points_gain > points_gain_total
  let dex_points_gain = (ns.formulas.gang.ascensionPointsGain(member.dex_exp))
  let condition3 = agi_points_gain > points_gain_total
  let def_points_gain = (ns.formulas.gang.ascensionPointsGain(member.def_exp))
  let condition4 = agi_points_gain > points_gain_total
  return condition1 || condition2 || condition3 || condition4
}

function canPurchaseEquipment(ns:NS){
  
}

export async function main(ns: NS) {
  let mult_gain_factor = 1.25
  let points_gain_total = 5000
  while (true) {
    let members = ns.gang.getMemberNames()
    let stats = members.map(m => { return ns.gang.getMemberInformation(m) })


    stats.forEach((m, i) => {
      if (readyToAscend1(ns, m, mult_gain_factor)) {
        console.log(m)
        ns.gang.ascendMember(m.name)
      }
    })
    await ns.gang.nextUpdate()
  }
}