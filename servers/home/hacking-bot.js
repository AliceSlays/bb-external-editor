/** @param {NS} ns */
export async function main(ns) {
  var pHostname = "neo-net";

  var pRamCostHack = ns.getFunctionRamCost("hack");
  var pRamCostWeaken = ns.getFunctionRamCost("weaken");
  var pRamCostGrow = ns.getFunctionRamCost("grow");

  // weaken, always weakens by const ammount, but in different time, depending on sec level
  // grow, time and money depend on seclvl

  ns.ui.openTail();

  ns.getServerMinSecurityLevel(pHostname);
  ns.getServerSecurityLevel(pHostname);
  ns.getServerBaseSecurityLevel(pHostname);
  ns.getServerGrowth(pHostname);
  ns.getServerMoneyAvailable(pHostname);
  ns.getServerMaxMoney(pHostname);
  ns.getServerRequiredHackingLevel(pHostname);
  
  ns.printRaw(`getHackTime ${ns.getHackTime(pHostname)}`);
  ns.printRaw(`getWeakenTime ${ns.getWeakenTime(pHostname)}`);
  ns.printRaw(`getGrowTime ${ns.getGrowTime(pHostname)}`);
  await ns.grow(pHostname);
  
  ns.getServerMinSecurityLevel(pHostname);
  ns.getServerSecurityLevel(pHostname);
  ns.getServerBaseSecurityLevel(pHostname);
  ns.getServerGrowth(pHostname);
  ns.getServerMoneyAvailable(pHostname);
  ns.getServerMaxMoney(pHostname);
  ns.getServerRequiredHackingLevel(pHostname);
  ns.printRaw(`getHackTime ${ns.getHackTime(pHostname)}`);
  ns.printRaw(`getWeakenTime ${ns.getWeakenTime(pHostname)}`);
  ns.printRaw(`getGrowTime ${ns.getGrowTime(pHostname)}`);
  /*
  //ns.hack
  ns.hackAnalyze(pHostname)
  ns.hackAnalyzeChance(pHostname)
  ns.hackAnalyzeSecurity(1,pHostname)
  ns.hackAnalyzeThreads(pHostname,0)
  ns.getHackTime(pHostname)
  ns.getWeakenTime(pHostname)
  ns.getGrowTime(pHostname)
  //ns.weaken
  ns.weakenAnalyze(1,1)
  //ns.grow
  ns.growthAnalyze(pHostname,1,1)
*/



}