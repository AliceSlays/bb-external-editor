
import { ServerList, ServerOption, ServerOptionList } from './dashboard/dashboard-common.tsx';
import { fetchServerList } from './dashboard/server-info.tsx';

function updateTargets(ns: NS, targets: string[]) {
  var potentialTargets = fetchServerList(ns);
  potentialTargets = potentialTargets.filter(target => {
    if (target.stats!.purchasedByPlayer) {
      return false
    }
    if (targets.includes(target.hostname)) {
      return false
    }
    return true;
  })
  var extra_t = potentialTargets.map(target => target.hostname);
  targets = targets.concat(extra_t)
  return targets
}


function find_contracts(ns: NS, target: string) {
  var files = ns.ls(target, '.cct')
  if (files.length > 0) {
    console.log(target,ns.getServerRequiredHackingLevel(target) ,files)
  }
}
export async function main(ns: NS) {
  var targets: string[] = [];
  targets = updateTargets(ns, targets)
  targets.forEach(target => find_contracts(ns, target))


}