/** @param {NS} ns */
export async function main(ns) {
  const ram = 2 ** 3;
  const cost = ns.getPurchasedServerCost(ram);
  ns.tprint(`A purchased server with ${ns.formatRam(ram)} costs $${ns.formatNumber(cost)}`);
  ns.tprint(`Maximum number of ownable servers ${ns.getPurchasedServerLimit()}`);
  ns.tprint(`Maximum ammount of RAM on purchasable servers ${ns.formatRam(ns.getPurchasedServerMaxRam())}`);
  ns.tprint(`Purchased server names ${ns.getPurchasedServers()}`);
  ns.tprint(`Purchased server RAM upgrade costs ${ns.getPurchasedServerUpgradeCost(1,2*ns.getServerMaxRam(1))}\$ from ${ns.formatRam(ns.getServerMaxRam(1))} to ${ns.formatRam(2*ns.getServerMaxRam(1))}`);
  ns.tprint(`Server ${ns.getServer(1).ramUsed}`);
}