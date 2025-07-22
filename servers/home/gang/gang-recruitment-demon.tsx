


const names = ['Carlos', 'Nick', 'Jimmy', 'Tony', 'Marcus', 'Romeo', 'Alfredo', ' Tosh', 'Uruk', 'Dominic', 'River', 'Alice']

export async function main(ns: NS) {
  if (!ns.gang.inGang()) {
    ns.tprintf("Not in gang!")
    return
  }



  while (true) {
    var members = ns.gang.getMemberNames()
    if (ns.gang.canRecruitMember()) {
      ns.gang.recruitMember(names[members.length])
    }
    await ns.sleep(10000)
  }
}