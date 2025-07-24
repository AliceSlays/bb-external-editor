
function can_afford(ns: NS, eq_name: string) {
  return ns.gang.getEquipmentCost(eq_name) < ns.getPlayer().money
}

export async function main(ns: NS) {
  if(!ns.gang.inGang()){
    ns.tprintf("Not in gang!")
    return
  }
  var upgrades = ns.gang.getEquipmentNames()
  var equipment = upgrades.filter(up => ns.gang.getEquipmentType(up) != 'Augmentation')
  var augs = upgrades.filter(up => ns.gang.getEquipmentType(up) == 'Augmentation')
  while (true) {
  var staff = ns.gang.getMemberNames();
    staff.forEach((name, index) => {
      var info = ns.gang.getMemberInformation(name)
      var owned_eq = info.upgrades
      var owned_augs = info.augmentations
      var owned_upgrades = owned_eq.concat(owned_augs)
      var purchased: string[] = [];
      equipment.forEach(up => {
        if (can_afford(ns, up) && !owned_upgrades.includes(up)) {
          if (ns.gang.purchaseEquipment(name, up)) {
            purchased.push(up)
          }
        }
      })
      if (purchased.length > 0) {
        console.log(`${name} bought ${purchased.toString()}`)
      }
    })

    await ns.sleep(1000)
  }
}