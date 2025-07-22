/** @param {NS} ns */
export async function main(ns) {
  var pScriptFileName = ns.args[0];
  if (!ns.fileExists(pScriptFileName)) {
    ns.tprint(`No file ${pScriptFileName} found!`);
    return;
  }
  var pServerList = ns.getPurchasedServers();
  var pScriptRamCost = ns.getScriptRam(pScriptFileName);
  ns.tprint(`Script cost ${pScriptRamCost}`);
  pServerList.forEach((hostname) => {
    var pServerRamMax = ns.getServerMaxRam(hostname);
    ns.killall(hostname);
    ns.scp(pScriptFileName, hostname);
    var threads = Math.floor(pServerRamMax / pScriptRamCost);
    if (threads > 0) {
      ns.exec(pScriptFileName, hostname, Math.floor(pServerRamMax / pScriptRamCost), ns.args[1]);
    }
  })
  ns.tprint(`Script ${pScriptFileName} deployed!`);
}