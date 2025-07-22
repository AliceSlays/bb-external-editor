/** @param {NS} ns */
export async function main(ns) {
  var pHostname = "home"
  var pHomeRamUsePercentage = ns.args[1];
  var pScriptFileName = ns.args[0];
  if (!ns.fileExists(pScriptFileName)) {
    ns.tprint(`No file ${pScriptFileName} found!`);
    return;
  }
  ns.scriptKill(pScriptFileName, pHostname);
  var pScriptRamCost = ns.getScriptRam(pScriptFileName)
  var pServerRamMax = ns.getServerMaxRam(pHostname);
  var pHomeRamUse = pServerRamMax * pHomeRamUsePercentage;
  if((pServerRamMax - ns.getServerUsedRam(pHostname)) < pHomeRamUse){
    ns.tprint(`Not enough RAM: Max ${pServerRamMax}, Used ${ns.getServerUsedRam(pHostname)}, Needed ${pHomeRamUse}`);
  }
  ns.scp(pScriptFileName, pHostname);
  ns.exec(pScriptFileName, pHostname, Math.floor(pHomeRamUse / pScriptRamCost), ns.args[2]);
  ns.tprint(`Script ${pScriptFileName} deployed!`);
}