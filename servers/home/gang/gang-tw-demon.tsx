

/*
[
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
*/

function setAllTW(ns: NS) {
  let members = ns.gang.getMemberNames()
  members.forEach(m => ns.gang.setMemberTask(m, "Territory Warfare"))

}
function setAllback(ns: NS, member_tasks: { member: string, task: string }[]) {
  member_tasks.forEach(m => ns.gang.setMemberTask(m.member, m.task))

}

async function getTicksBetween(ns: NS) {
  let members = ns.gang.getMemberNames()
  let member_tasks = members.map((member) => {
    return { member: member, task: ns.gang.getMemberInformation(member).task }
  })
  setAllTW(ns)
  let ticks_between = await powerChange(ns)
  ticks_between = await powerChange(ns)
  setAllback(ns, member_tasks)
  return ticks_between

}

async function powerChange(ns: NS) {
  let current_power = ns.gang.getGangInformation().power
  let count = 0
  while (true) {
    if (current_power != ns.gang.getGangInformation().power) {
      return count
    }
    await ns.gang.nextUpdate()
    count++
  }
}

async function doTW(ns: NS) {
  let members = ns.gang.getMemberNames()
  let member_tasks = members.map((member) => {
    return { member: member, task: ns.gang.getMemberInformation(member).task }
  })
  setAllTW(ns)
  await powerChange(ns)
  setAllback(ns, member_tasks)

}
class TWTickCounter {
  // 20 gang ticks per TW update
  next_tw_tick_at_9 = 0; // 0-9; 9 before TW, 0 after TW

  constructor() {
  }

  // do every cycle
  doTick() {
    this.next_tw_tick_at_9 = (this.next_tw_tick_at_9 + 1) % 10
  }

  // do reset after TW tick
  resetTick() {
    this.next_tw_tick_at_9 = 0; // 0-19
  }

  // is next tick TW update?
  is_next_TW_update() {
    return this.next_tw_tick_at_9 == 9;
  }

  getTick() {
    return this.next_tw_tick_at_9
  }

}

export async function main(ns: NS) {
  // run recruitment
  // ns.exec...
  //ns.formulas.gang.moneyGain(ns.gang.getGangInformation(),ns.gang.getMemberInformation(''),ns.gang.getTaskStats(''))
  //ns.formulas.gang.ascensionPointsGain
  let twCounter = new TWTickCounter()
  await doTW(ns)
  twCounter.resetTick()
  let tasks = ns.gang.getMemberNames().map(n => {return {name:n, task:ns.gang.getMemberInformation(n).task}})
  while (true) {
    // recruitment runs in parallel
    let members = ns.gang.getMemberNames().map((m, i) => { return ns.gang.getMemberInformation(m) })
    // need resp? disc? power? money? stats? eq? territory?
    // collective action or individual?
    if (twCounter.getTick() == 0) {
      tasks.forEach((m, i) => {
        ns.gang.setMemberTask(m.name,m.task)
      })
    } else if (twCounter.is_next_TW_update()) {
      tasks = members.map((m,i)=>{return {name:m.name, task:m.task}})
      setAllTW(ns)
    }
    await ns.gang.nextUpdate()
    twCounter.doTick()
  }

}