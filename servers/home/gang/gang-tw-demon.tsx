

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

async function getTicksBetween(ns: NS, tick_duration) {
    let members = ns.gang.getMemberNames()
    let member_tasks = members.map((member) => {
        return { member: member, task: ns.gang.getMemberInformation(member).task }
    })
    setAllTW(ns)
    let ticks_between = await powerChange(ns, tick_duration)
    ticks_between = await powerChange(ns, tick_duration)
    setAllback(ns, member_tasks)
    return ticks_between

}

async function powerChange(ns: NS, tick_duration: number) {
    let current_power = ns.gang.getGangInformation().power
    let count = 0
    while (true) {
        if (current_power != ns.gang.getGangInformation().power) {
            return count
        }
        await ns.sleep(tick_duration)
        count++
    }
}

async function doTW(ns: NS, tick_duration: number) {
    let members = ns.gang.getMemberNames()
    let member_tasks = members.map((member) => {
        return { member: member, task: ns.gang.getMemberInformation(member).task }
    })
    setAllTW(ns)
    await powerChange(ns, tick_duration)
    setAllback(ns, member_tasks)

}

export async function main(ns: NS) {
    // siwtch tasks tw / whatever was before, for power

    let tick_duration = 600

    let start = Date.now()
    await doTW(ns, tick_duration)
    let timer = 20000
    let next_tick_at = Date.now() + timer
    console.log(timer) 
    while (true) {

        if (next_tick_at-tick_duration < Date.now() + tick_duration) {
            await doTW(ns,200)
            next_tick_at = Date.now() + timer
        }

        await ns.sleep(tick_duration)
    }
}