import { GangMemberInfo, GangGenInfo, GangTaskStats } from 'NetscriptDefinitions'







/*

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
    */

// recruit
// farm resp
// farm money
// farm power
// farm mult / asc / train
// farm augs

// pick tasks
// pick ascention
// pick equipment
// pick TW

// death chance   const modifiedDeathChance = 0.01 / Math.pow(member.def, 0.6);

function setAllTW(ns: NS) {
  let members = ns.gang.getMemberNames()
  members.forEach(m => ns.gang.setMemberTask(m, "Territory Warfare"))

}
function setAllback(ns: NS, member_tasks: { member: string, task: string }[]) {
  member_tasks.forEach(m => ns.gang.setMemberTask(m.member, m.task))

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
  console.log(member_tasks)
  setAllTW(ns)
  await powerChange(ns)
  setAllback(ns, member_tasks)
  member_tasks = members.map((member) => {
    return { member: member, task: ns.gang.getMemberInformation(member).task }
  })
  console.log(member_tasks)

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

function getTaskEarnings(ns: NS, gang: GangGenInfo, member: GangMemberInfo, task:GangTaskStats):ITaskEarnings {
  let tasks = ns.gang.getTaskNames()
  let respect = ns.formulas.gang.respectGain(gang, member, task)
  let money = ns.formulas.gang.moneyGain(gang,member,task)
  let wantedLevel = ns.formulas.gang.wantedLevelGain(gang,member,task)
  return {task:task.name, money:money, respect:respect, wantedLevel:wantedLevel, stats: task.difficulty}
}

interface ITaskEarnings {
  task: string,
  money: number,
  respect: number,
  wantedLevel: number,
  stats: number

}

// calc task every tw tick
export async function main(ns: NS) {
  if (!ns.gang.inGang()) {
    console.log("Not in gang!")
    return
  }
  //ns.formulas.gang.moneyGain(ns.gang.getGangInformation(),ns.gang.getMemberInformation(''),ns.gang.getTaskStats(''))
  //ns.formulas.gang.ascensionPointsGain
  let twCounter = new TWTickCounter()
  await doTW(ns)
  twCounter.resetTick()
  while (true) {
    if (twCounter.is_next_TW_update()) {
      let members = ns.gang.getMemberNames()
      let member_tasks = members.map((member) => {
        return { member: member, task: ns.gang.getMemberInformation(member).task }
      })
      //console.log(member_tasks)
      setAllTW(ns)
      await ns.gang.nextUpdate()
      setAllback(ns, member_tasks)
    } else {
      await ns.gang.nextUpdate()
    }
    twCounter.doTick()
  }

}