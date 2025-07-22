/** @param {NS} ns */
export async function main(ns) {
  ns.scriptKill(ns.args[0],ns.args[1]);
  ns.exec(ns.args[0],ns.args[1]);
}