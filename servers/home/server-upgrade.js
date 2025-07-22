/** @param {NS} ns */
export async function main(ns) {
  //ns.scriptKill("server-upgrade.js","home");
  ns.disableLog('ALL')
  var pServerRamLimit = 2**ns.args[0];
  ns.tprint(`Upgrading to ${ns.formatRam(pServerRamLimit)}`);
  var vContinue = true;
  while (vContinue) {
    vContinue = false;
    if (ns.getPurchasedServers().filter((hostname) => ns.getServerMaxRam(hostname) < ns.getPurchasedServerMaxRam()).length == 0) {
      ns.tprint("All servers Upgraded to max RAM!");
      break;
    }
    await ns.sleep(5000);
    ns.getPurchasedServers().filter((hostname) => ns.getServerMaxRam(hostname) < ns.getPurchasedServerMaxRam()).forEach((hostname) => {
      var vServerRamCurrent = ns.getServerMaxRam(hostname);
      if (vServerRamCurrent < pServerRamLimit) {
        vContinue = true;
        var vServerUpgradeCost = ns.getPurchasedServerUpgradeCost(hostname, 2 * vServerRamCurrent);
        if (ns.getPlayer().money-1000000 > vServerUpgradeCost) {
          if (ns.upgradePurchasedServer(hostname, 2 * vServerRamCurrent)) {
            ns.printRaw(`Upgraded server ${hostname} from ${ns.formatRam(vServerRamCurrent)} to ${ns.formatRam(2 * vServerRamCurrent)} for ${ns.formatNumber(vServerUpgradeCost,3,1000)}.`);
          }
        }
      }
    })
  }
}