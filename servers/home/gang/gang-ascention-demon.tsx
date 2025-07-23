export async function main(ns: NS) {
  if (!ns.gang.inGang()) {
    console.log("Not in gang!")
    return
  }

  function ascention_condition_1(ns: NS, member: string): boolean {
    var info = ns.gang.getMemberInformation(member)
    return false
  }


  const tasks = [
    "Unassigned",
    "Mug People",
    "Deal Drugs",
    "Strongarm Civilians",
    "Run a Con",
    "Armed Robbery",
    "Traffick Illegal Arms",
    "Threaten & Blackmail",
    "Human Trafficking",
    "Terrorism",
    "Vigilante Justice",
    "Train Combat",
    "Train Hacking",
    "Train Charisma",
    "Territory Warfare"
  ]

  while (true) {

    var members = ns.gang.getMemberNames()


    await ns.sleep(1000)
  }

}