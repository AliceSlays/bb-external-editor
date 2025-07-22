import { ServerListItem, ServerList } from './dashboard-common.tsx'


export function recursiveExploration(ns: NS, { hostname, parent, depth }: { hostname: string, parent: string, depth: number }): ServerList {

  var server = ns.getServer(hostname);
  var vPlayerHackingSkill = ns.getHackingLevel();
  if (server.purchasedByPlayer) {
    if (server.hostname != "home") {
      return [];
    }
  }
  if (!server.requiredHackingSkill === undefined) {
    if (server.requiredHackingSkill ?? 0 > vPlayerHackingSkill) {
      return [];
    }
  }
  if (!server.hasAdminRights) {
    return [];
  }

  var availableServers: ServerList = [];
  var children = ns.scan(hostname);
  for (var child of children) {
    if (child != parent) {
      var retServers = recursiveExploration(ns, { hostname: child, parent: hostname, depth: depth + 1 });
      availableServers = availableServers.concat(retServers);
    }
  }
  var explored: ServerListItem = { key: server.hostname, hostname: server.hostname, parent: parent, depth: depth, stats: server }
  return [...availableServers, explored];
}
/** @param {NS} ns */
export function fetchServerList(ns: NS): ServerList {
  try {

    ns.disableLog("ALL");
    return recursiveExploration(ns, { hostname: 'home', parent: '', depth: 0 });
  } catch (error) {
    console.log("Error in fetchServerList: ", error);

    return [];
  }
}

export async function main(ns: NS) {
  // prints a table of servers with max money and hack level and min security
  ns.ui.openTail();
  ns.disableLog('getServer');
  ns.disableLog('getHackingLevel');
  ns.disableLog('scan');
  const servList = fetchServerList(ns);
  const servItemized = (
    <ul >
      {servList.map(item => (<li>{item.hostname}, {item.depth?.toString()}</li>))}
    </ul >
  );
  ns.printRaw(servItemized)
}