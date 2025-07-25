export async function main(ns: NS) {
  
  console.log(ns.heart.break())
  
  var name = 'Carlos'
  var info = ns.gang.getMemberInformation(name)
  var exp_str = info.str_exp
     var points = ns.formulas.gang.ascensionPointsGain(exp_str )
   var mult = ns.formulas.gang.ascensionMultiplier(points)
  console.log(exp_str,mult)
  console.log(info.str_asc_mult,info.str_asc_mult * mult)
  // ### task
ns.gang.getTaskNames
ns.gang.getTaskStats
ns.gang.setMemberTask

  // ### information
ns.gang.getBonusTime

  // ### gang
ns.gang.getGangInformation
ns.gang.canRecruitMember
ns.gang.getAscensionResult
ns.gang.getInstallResult
ns.gang.getMemberInformation
ns.gang.getMemberNames
ns.gang.getRecruitsAvailable
ns.gang.ascendMember
ns.gang.createGang
ns.gang.inGang
ns.gang.recruitMember
ns.gang.renameMember
ns.gang.respectForNextRecruit

  // ### territory
ns.gang.getChanceToWinClash
ns.gang.getOtherGangInformation
ns.gang.nextUpdate
ns.gang.setTerritoryWarfare

  // ### equipment
ns.gang.getEquipmentCost
ns.gang.getEquipmentNames
ns.gang.getEquipmentStats
ns.gang.getEquipmentType
ns.gang.purchaseEquipment
ns.formulas.gang.ascensionMultiplier
ns.formulas.gang.ascensionPointsGain
ns.formulas.gang.moneyGain
ns.formulas.gang.respectGain
ns.formulas.gang.wantedLevelGain
ns.formulas.gang.wantedPenalty

}