
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


function doTaskAll(ns: NS, names: string[], task: string) {
  names.forEach(name => ns.gang.setMemberTask(name, task))
}

function doTaskCombatTraining(ns: NS) {
  doTaskAll(ns, ns.gang.getMemberNames(), 'Train Combat')
}
function doTaskTerrorism(ns: NS) {
  doTaskAll(ns, ns.gang.getMemberNames(), 'Terrorism')
}
function doTaskIA(ns: NS) {
  doTaskAll(ns, ns.gang.getMemberNames(), 'Traffick Illegal Arms')
}
function doTaskHT(ns: NS) {
  doTaskAll(ns, ns.gang.getMemberNames(), 'Human Trafficking')
}
function doTaskTW(ns: NS) {
  doTaskAll(ns, ns.gang.getMemberNames(), 'Territory Warfare')
}
function ascendAll(ns: NS) {
  var names = ns.gang.getMemberNames()
  names.forEach(name => { ns.gang.ascendMember(name) })
}
export async function main(ns: NS) {

  var doc = document
  ReactDOM.render(
    <div>
      <button onClick={() => { doTaskCombatTraining(ns) }}>TC</button>
      <button onClick={() => { doTaskTerrorism(ns) }}>T</button>
      <button onClick={() => { doTaskIA(ns) }}>IA</button>
      <button onClick={() => { doTaskHT(ns) }}>HT</button>
      <button onClick={() => { doTaskTW(ns) }}>TW</button>
      <button onClick={() => { ascendAll(ns) }}>AA</button>
    </div>
    , doc.getElementById("overview-extra-hook-0"))
  while (true) {
    await ns.asleep(1000)
  }

}