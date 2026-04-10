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
interface ITaskStatsEarnings {
  hack: number,
  str: number,
  def: number,
  dex: number,
  agi: number,
  cha: number
}

enum EStatsBlock {
  'hack', 'str', 'def', 'dex', 'agi', 'cha'
}
type TypeStatsBlock = keyof typeof EStatsBlock

function getStats(ns: NS, member: GangMemberInfo, task: GangTaskStats): ITaskStatsEarnings {
  function getS(k: TypeStatsBlock) {
    type TaskKey = keyof typeof task;
    type MemberKey = keyof typeof member;
    const weight = k + 'Weight' as TaskKey;
    const asc_mult = k + '_asc_mult' as MemberKey;
    const mult = k + '_mult' as MemberKey;
    return (task[weight] / 96 * task.difficulty * member[asc_mult] * member[mult])
  }
  let stats: ITaskStatsEarnings;
  for (let k in EStatsBlock) {
    stats[k] = getS(k)
  }
  return stats
}

function getTaskEarnings(ns: NS, gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): ITaskEarnings {
  let respect = ns.formulas.gang.respectGain(gang, member, task)
  let money = ns.formulas.gang.moneyGain(gang, member, task)
  let wantedLevel = ns.formulas.gang.wantedLevelGain(gang, member, task)
  let stats = getStats(ns, member, task) // complex math
  // get multipliers + eq
  // get weight
  // get difficulty
  return { task: task.name, money: money, respect: respect, wantedLevel: wantedLevel, stats: stats }
}

interface ITaskEarnings {
  task: string,
  money: number,
  respect: number,
  wantedLevel: number,
  stats: ITaskStatsEarnings

}

interface ITaskTimeTo {
  task: string,
  timeToInCycles: number
}

type TTaskTimeToU = ITaskTimeTo | undefined

interface IMemberTimeTo {
  member: string,
  wantedPenaltyCondition1: TTaskTimeToU,
  moneyCondition1: TTaskTimeToU,
  nextRecruit: TTaskTimeToU,
  ascentionCondition1: TTaskTimeToU
}

function readyToAscend(ns: NS, member: string): boolean {
  return true
}


// optimize for wanted penalty decrease
function getTimeToWantedPenaltyCondition1(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[]): TTaskTimeToU {
  let r_w_ratio = tasks_info.map((t, i) => {
    if (t.respect == 0 || t.wantedLevel == 0 || t.wantedLevel > t.respect) {
      return 0
    }
    return t.respect / t.wantedLevel
  }) // wanted penalty for each task
  // rw below 1 is bad
  // rw below current wPenalty is bad
  // pick best rw ratio
  let r_w_best = Math.max(...r_w_ratio)
  let index = r_w_ratio.findIndex((r) => r == r_w_best)
  if (r_w_best == 0) {
    return undefined
  }
  // algebra ((x*p+g))/((x*c+z))=((1.1*p))/((c)) 
  // solve for x: x=-(11z/c)+(10g/p)
  let timeToPenaltyWithin10pp = -(11 * gang.wantedLevel / tasks_info[index].wantedLevel) + (10 * gang.respect / tasks_info[index].respect)

  // pick task with max respect, see if higher than wanted level gain, can
  return { task: tasks_info[index].task, timeToInCycles: timeToPenaltyWithin10pp }
}

function getTimeToMoneyCondition1(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[]): TTaskTimeToU {
  let best_money = Math.max(...tasks_info.map((t) => { return t.money }))
  let upgrades = ns.gang.getEquipmentNames()
  let equipment = upgrades.filter(up => ns.gang.getEquipmentType(up) != 'Augmentation')
  let augs = upgrades.filter(up => ns.gang.getEquipmentType(up) == 'Augmentation')


  let cheapest_aug = Math.min(...augs.map(a => { return ns.gang.getEquipmentCost(a) }))
  if (best_money <= 0) {
    return undefined
  }
  let index = tasks_info.findIndex((t) => t.money == best_money)
  let timeToCheapestAug = cheapest_aug / best_money
  return { task: tasks_info[index].task, timeToInCycles: timeToCheapestAug }

}

// some checkbox earn money
function getTimeToMoneyCondition2(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[]): TTaskTimeToU {
  let best_money = Math.max(...tasks_info.map((t) => { return t.money }))
  let index = tasks_info.findIndex((t) => t.money == best_money)
  return { task: tasks_info[index].task, timeToInCycles: 0 }
}


function getTimeToNextRecruit(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[]): TTaskTimeToU {
  let respect_needed = gang.respectForNextRecruit - gang.respect
  let best_respect = Math.max(...tasks_info.map((t) => { return t.respect }))
  let index = tasks_info.findIndex((t) => t.money == best_respect)
  if (best_respect <= 0) {
    return undefined
  }
  let timeToNextRecruit = respect_needed / best_respect
  return { task: tasks_info[index].task, timeToInCycles: timeToNextRecruit }

}

function getTimeToAscend1(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[], factor: number): TTaskTimeToU {

  // get all multipliers
  // what is the asc condition?
  function getTimeToAscendForStatPointsFactor(stat: ITaskStatsEarnings, key: TypeStatsBlock) {
    // stat points - exp / stat
    let points = member[key + '_asc_points']
    let exp = member[key + '_exp']
    let earnings = stat[key]
    let goal = points * factor
    return (goal - exp) / earnings
  }
  function getTimeToAscendForStatMultFactor(stat: ITaskStatsEarnings, key: TypeStatsBlock) {
    // stat points - exp / stat
    let points = member[key + '_asc_points']
    let exp = member[key + '_exp']
    let earnings = stat[key]
    let points_gained = points + exp - 1000
    let mult = member[key + '_asc_mult']
    let new_mult = Math.max(Math.pow(points_gained / 2000, 0.5), 1)
    let goal = mult * factor

    // new_mult/mult == factor
    // ((p+c*t) / 2000)^0.5 = (b / 2000)^0.5 * z

    // t = (points * factor^2 - points_gained) / earnings
    return (points * factor ^ 2 - points_gained) / earnings
  }

  // ascend condition is prev points factor or prev mult
  // calc ascend speed for every task and every stat
  // store min ascend speed for all tasks and task name
  let stats_min = { task: '', timeToInCycles: 0 };
  tasks_info.forEach((t, i) => {
    for (let k in EStatsBlock) {
      let tts = getTimeToAscendForStatMultFactor(t.stats[k], k)
      let task = t.task
      let stats_alt = { task: task, timeToInCycles: tts }
      stats_min = (stats_min.timeToInCycles < stats_alt.timeToInCycles) ? stats_min : stats_alt
    }
  })
  return stats_min

}


function getTimeTo(ns: NS, gang: GangGenInfo, member: GangMemberInfo, tasks_info: ITaskEarnings[]): IMemberTimeTo {
  return {
    member: member.name,
    wantedPenaltyCondition1: getTimeToWantedPenaltyCondition1(ns, gang, member, tasks_info),
    moneyCondition1: getTimeToMoneyCondition1(ns, gang, member, tasks_info),
    nextRecruit: getTimeToNextRecruit(ns, gang, member, tasks_info),
    ascentionCondition1: getTimeToAscend1(ns, gang, member, tasks_info, 1.1)

  }
}

function decideTasks(ns: NS, gang: GangGenInfo, member: GangMemberInfo) {
  let tasks = ns.gang.getTaskNames()
  let tasks_info: ITaskEarnings[] = tasks.map((t, i) => {
    return getTaskEarnings(ns, gang, member, ns.gang.getTaskStats(t))
  })

  // ascention



  if (readyToAscend(ns, member.name)) {
    ns.gang.ascendMember(member.name)
  } else {

  }
}

// calc task every tw tick
export async function main(ns: NS) {
  if (!ns.gang.inGang()) {
    console.log("Not in gang!")
    return
  }
  ns.getBitNodeMultipliers()
  // run recruitment
  // ns.exec...
  //ns.formulas.gang.moneyGain(ns.gang.getGangInformation(),ns.gang.getMemberInformation(''),ns.gang.getTaskStats(''))
  //ns.formulas.gang.ascensionPointsGain
  let twCounter = new TWTickCounter()
  await doTW(ns)
  twCounter.resetTick()
  let tasks = ns.gang.getTaskNames()
  while (true) {
    // recruitment runs in parallel
    let members = ns.gang.getMemberNames().map((m, i) => { return ns.gang.getMemberInformation(m) })
    let gang = ns.gang.getGangInformation()
    // need resp? disc? power? money? stats? eq? territory?
    // collective action or individual?

    if (twCounter.getTick() == 0) {
      members.forEach((m, i) => {
        decideTasks(ns, gang, m)
      })
    } else if (twCounter.is_next_TW_update()) {
      setAllTW(ns)
    }
    await ns.gang.nextUpdate()
    twCounter.doTick()
  }

}