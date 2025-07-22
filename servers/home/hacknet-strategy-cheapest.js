/** @param {NS} ns */
export async function main(ns) {
  //ns.scriptKill("hacknet-strategy-cheapest.js","home");
  // round levels up to a factor of increments
  var pIncrementsLevel = 10;
  var pIncrementsRam = 1;
  var pIncrementsCore = 1;
  var pHacknetNodesLimit = 18;
  var pCoresMax = 8;
  
  while (true) {
    ns.disableLog('ALL')
    await ns.sleep(10000);
    var vHacknetNodesActive = ns.hacknet.numNodes();
    var pHacknetNodePurchaseCost = ns.hacknet.getPurchaseNodeCost();
    var vPlayerMoney = ns.getPlayer().money-1000000;
    if (vPlayerMoney > pHacknetNodePurchaseCost && vHacknetNodesActive < pHacknetNodesLimit) {
      ns.hacknet.purchaseNode();
      continue;
    }
    for (let node_id = 0; node_id < vHacknetNodesActive; node_id++) {
      var pHacknetNodeStatsRam = ns.hacknet.getNodeStats(node_id).ram;
      var vSeekToBuyRam = pIncrementsRam - pHacknetNodeStatsRam % pIncrementsRam;
      var pHacknetNodeUpgradeCostRam = ns.hacknet.getRamUpgradeCost(node_id, vSeekToBuyRam);
      if (vPlayerMoney > pHacknetNodeUpgradeCostRam) {
        ns.hacknet.upgradeRam(node_id, vSeekToBuyRam);
        continue;
      }
      var pHacknetNodeStatsLevel = ns.hacknet.getNodeStats(node_id).level;
      var vSeekToBuyLevels = pIncrementsLevel - pHacknetNodeStatsLevel % pIncrementsLevel;
      var pHacknetNodeUpgradeCostLevel = ns.hacknet.getLevelUpgradeCost(node_id, vSeekToBuyLevels);
      if (vPlayerMoney > pHacknetNodeUpgradeCostLevel) {
        ns.hacknet.upgradeLevel(node_id, vSeekToBuyLevels);
        continue;
      }
      var pHacknetNodeStatsCores = ns.hacknet.getNodeStats(node_id).cores;
      if(pHacknetNodeStatsCores >= pCoresMax){ continue;}
      var vSeekToBuyCores = pIncrementsCore - pHacknetNodeStatsCores % pIncrementsCore;
      var pHacknetNodeUpgradeCostCore = ns.hacknet.getCoreUpgradeCost(node_id, vSeekToBuyCores);
      if (vPlayerMoney > pHacknetNodeUpgradeCostCore) {
        ns.hacknet.upgradeCore(node_id, vSeekToBuyCores);
        continue;
      }
    }
  }
}