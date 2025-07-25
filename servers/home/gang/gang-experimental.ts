export async function main(ns: NS) {

  //while (true) {
  var name = 'Carlos'
  var info = ns.gang.getMemberInformation(name)
  var exp_str = info.str_exp
  var points = ns.formulas.gang.ascensionPointsGain(exp_str)
  var mult = ns.formulas.gang.ascensionMultiplier(points)
  console.log(exp_str, mult, points)
  console.log(info.str_asc_mult, info.str_asc_mult * mult) // earned asc
  await ns.gang.nextUpdate()

  var mems = ns.gang.getMemberNames()
  var infos = mems.map(m => {
    let stats = ns.gang.getMemberInformation(m)
    let points = ns.formulas.gang.ascensionPointsGain(stats.agi_exp) + stats.agi_asc_points


    return {
      stats: stats,
      points: points,
      mult: ns.formulas.gang.ascensionMultiplier(points)
    }
  })
  console.log(infos)

  //}
}