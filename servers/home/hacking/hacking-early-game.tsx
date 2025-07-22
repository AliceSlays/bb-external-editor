
import { HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'
import { ScriptDeployer } from '../hacking/hacking-server-manager.tsx'

/** @param {NS} ns */
export async function main(ns: NS) {
  // Defines the "target server", which is the server
  // that we're going to hack. In this case, it's "n00dles"
  var target;
  if (ns.args.length == 0) {
    target = 'n00dles';
  } else {
    target = String(ns.args[0]);
  }
  // Defines how much money a server should have before we hack it
  // In this case, it is set to the maximum amount of money.
  const moneyThresh = ns.getServerMaxMoney(target);

  // Defines the minimum security level the target server can
  // have. If the target's security level is higher than this,
  // we'll weaken it before doing anything else
  const securityThresh = ns.getServerMinSecurityLevel(target);

  const deployManager = new ScriptDeployer(ns, [{ hostname: 'home', rammodifier: 0.8 }], { purchased: true, hacked: true })
  // Infinite loop that continously hacks/grows/weakens the target server
  while (true) {
    deployManager.updateServerList(ns);
    console.log(ns.getServerSecurityLevel(target), ns.formatNumber(ns.getServerMoneyAvailable(target), 3, 1000))
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // If the server's security level is above our threshold, weaken it
      deployManager.deployScriptBatch(ns, { fileName: HackActionFiles['W'], args: [target] }, 99999, true, true)
      var waittime = ns.getWeakenTime(target)
      await ns.sleep(waittime + 200)
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // If the server's money is less than our threshold, grow it
      var threads = deployManager.can_deploy_threads(ns, { fileName: HackActionFiles['G'], args: [target] }, 99999)
      var w_threads = Math.ceil(threads * HackActionDifficulty['G'] / -HackActionDifficulty['W'])
      var g_threads = threads - w_threads
      var c1 = deployManager.deployScriptBatch(ns, { fileName: HackActionFiles['G'], args: [target] }, g_threads, true, true)
      var c2 = deployManager.deployScriptBatch(ns, { fileName: HackActionFiles['W'], args: [target] }, w_threads, true, true)
      console.log('wg',threads,g_threads,w_threads,c1,c2)
      var waittime = ns.getWeakenTime(target)
      await ns.sleep(waittime + 200)
    } else {
      var threads = deployManager.can_deploy_threads(ns, { fileName: HackActionFiles['H'], args: [target] }, 99999)
      var w_threads = Math.ceil(threads * HackActionDifficulty['H'] / -HackActionDifficulty['W'])
      var h_threads = threads - w_threads
      deployManager.deployScriptBatch(ns, { fileName: HackActionFiles['H'], args: [target] }, h_threads, true, true)
      deployManager.deployScriptBatch(ns, { fileName: HackActionFiles['W'], args: [target] }, w_threads, true, true)
      // Otherwise, hack it
      var waittime = ns.getWeakenTime(target)
      await ns.sleep(waittime + 200)
    }
  }

}