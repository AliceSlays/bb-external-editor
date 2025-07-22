/** @param {NS} ns */
export async function main(ns) {
  //maximize owned servers
  var vPrivateServersOwned = ns.getPurchasedServers().length;
  var pPrivateServersMax = ns.getPurchasedServerLimit();
  var pServerPrefix = "pserv-";
  var pServerIndexCurrent = 0;
  const pPrivateServersStartingRam = 2 ** 0;
  ns.tprint(ns.getPurchasedServers().toString());

  // enforce naming scheme, if doesnt work change prefix
  for (const hostname of ns.getPurchasedServers()) {
    ns.tprint(hostname + ", ", ns.renamePurchasedServer(hostname, pServerPrefix + pServerIndexCurrent));
    pServerIndexCurrent++;
  }
  ns.tprint(ns.getPurchasedServers().toString());
  ns.tprint(ns.getPurchasedServers());
  while (true) {
    var serverList = ns.getPurchasedServers();
    if (pPrivateServersMax > serverList.length) {
        ns.printRaw(ns.purchaseServer(pServerPrefix + pServerIndexCurrent, pPrivateServersStartingRam));
      pServerIndexCurrent++;
    } else {
      ns.tprint("All Servers Purchased!");
      break;
    }
    await ns.sleep(200);
  }
}