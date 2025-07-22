export async function main(ns: NS) {
  var tasks = ns.gang.getTaskNames()
  tasks.forEach(task=>{console.log(ns.gang.getTaskStats(task))})

}