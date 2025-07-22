
import { HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'
import { ScriptDeployer } from '../hacking/hacking-server-manager.tsx'
import { PlanTracker } from '../hacking/hacking-plan-tracker.tsx';
import { fetchServerList } from '../dashboard/server-info.tsx';
import { ServerListItem, ServerList } from '../dashboard/dashboard-common.tsx'

interface ITargetPlanTracker {
  hostname: string,
  expected_end: number
}

function formatTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":");
}

// fetch targetable servers
// init plan for server HGW
// execute plan for server
// wait until plan fulfilled to init a new one
export class HackExecutionManager {
  pattern = [HackActionType['H'], HackActionType['G'], HackActionType['W']];
  targets: string[] = [];
  tpt: ITargetPlanTracker[] = []
  deployManager: ScriptDeployer;

  constructor(ns: NS, deployManager: ScriptDeployer) {
    this.deployManager = deployManager;
  }

  // fetch hacked servers
  // if not already initiated, add to list of targets
  updateTargets(ns: NS) {
    var potentialTargets = fetchServerList(ns);
    potentialTargets = potentialTargets.filter(target => {
      if (target.stats!.purchasedByPlayer) {
        return false
      }
      if (target.stats!.requiredHackingSkill! > ns.getHackingLevel()) {
        return false
      }
      if (target.stats!.moneyMax == 0) {
        return false;
      }
      if (!target.stats!.hasAdminRights) {
        return false;
      }
      if (ns.hackAnalyzeChance(target.hostname) == 0) {
        return false;
      }
      if (this.targets.includes(target.hostname)) {
        return false
      }
      if (this.tpt.find((tgt, index) => tgt.hostname == target.hostname) !== undefined) {
        return false
      }
      return true;
    })
    var extra_t = potentialTargets.map(target => target.hostname);
    this.targets = this.targets.concat(extra_t)
    var extra_tpt = potentialTargets.map(target => { return { hostname: target.hostname, expected_end: 0 } });
    this.tpt = this.tpt.concat(extra_tpt)
  }

  uptick(ns: NS) {
    this.deployManager.updateServerList(ns)
    var len = this.tpt.length
    this.updateTargets(ns)
    if (this.tpt.length > len) {
      ns.printf(this.tpt.map(t => t.hostname).toString())
    }
    var count = 0;
    while (count < this.tpt.length) {
      if (this.tpt[count].expected_end > Date.now() + 1000) {
        count++
        continue;
      }
      this.hackTarget(ns, this.tpt[count])

      count++
    }

  }


  deploy_action(ns: NS, target: string, actionType: HackActionType, threads: number, args: any[] = []) {
    return this.deployManager.deployScriptBatch(ns, { fileName: HackActionFiles[actionType], args: [target, ...args] }, threads, true)
  }
  is_optimal(ns: NS, target: string) {
    var server = ns.getServer(target)
    return (server.moneyAvailable == server.moneyMax) && (server.minDifficulty == server.hackDifficulty)
  }

  hackTarget(ns: NS, target: ITargetPlanTracker): boolean {
    var threads = this.getActionThreadsHGW(ns, target.hostname)
    var tthgw = this.getActionTimeHGW(ns, target.hostname)
    var delay_H = 400+tthgw[2] - tthgw[0]
    var delay_G = 600+tthgw[2] - tthgw[1]
    var delay_W = 800
    var extra_args:[[string,number]|[],[string,number]|[],[string,number]|[]];
    if (delay_H < 0 || delay_G < 0) {
      extra_args = [[], [], []]
    } else {
      extra_args = [['msec', delay_H], ['msec', delay_G], ['msec',delay_W]]
    }
    // var expected_end_of_H = Date.now()+delay_H+tthgw[0]
    if (this.deployManager.can_deploy_threads(ns, { fileName: HackActionFiles['W'], args: [target.hostname] }, threads.reduce((sum, item) => sum + item, 0))) {
      this.pattern.forEach((act, index) => {
        index = this.pattern.length-index-1
        act = this.pattern[index]
        if ((this.is_optimal(ns, target.hostname) || act != HackActionType['H'])) {
          if (this.deploy_action(ns, target.hostname, act, threads[index], extra_args[index])) {
            console.log(target.hostname, act, threads[index], formatTime(tthgw[index]), ns.formatNumber(ns.getServerMaxMoney(target.hostname), 3, 1000))
          }
        } else {
          console.log(target.hostname, act, ns.getServerSecurityLevel(target.hostname), ns.getServerMinSecurityLevel(target.hostname), ns.formatNumber(ns.getServerMoneyAvailable(target.hostname), 3, 1000), ns.formatNumber(ns.getServerMaxMoney(target.hostname), 3, 1000))
        }
      })
      target.expected_end = Math.max(...tthgw) + Date.now() + 1200
      return true
    } else {
      //console.log(`no room for more`)
      return false
    }
  }

  getActionThreadsHGW(ns: NS, target: string) {
    var thrHGW = []
    var server = ns.getServer(target)
    var player = ns.getPlayer()

    server.moneyAvailable = server.moneyMax!
    var chance = ns.formulas.hacking.hackChance(server, player)
    var hpc = ns.formulas.hacking.hackPercent(server, player)
    if (chance == 0 || hpc == 0) {
      thrHGW[0] = 0
    } else {
      thrHGW[0] = Math.ceil((1.2 / ns.formulas.hacking.hackPercent(server, player)) * (1 / chance))
    }
    thrHGW[0] = thrHGW[0] > 0 ? thrHGW[0] : 0

    server.moneyAvailable = 0
    thrHGW[1] = Math.ceil(ns.formulas.hacking.growThreads(server, player, server.moneyMax!) * 1.2)
    thrHGW[1] = thrHGW[1] > 0 ? thrHGW[1] : 0


    var secdiff = thrHGW[0] * HackActionDifficulty['H'] + thrHGW[1] * HackActionDifficulty['G'] + server.hackDifficulty! - server.minDifficulty! + 1
    secdiff = secdiff < 99 ? secdiff : 99;
    secdiff = secdiff > 1 ? secdiff : 1;
    thrHGW[2] = Math.ceil(1.2 * secdiff / -HackActionDifficulty['W'])
    return thrHGW

  }

  getActionTimeHGW(ns: NS, target: string) {
    var tthgw = []
    tthgw[0] = ns.formulas.hacking.hackTime(ns.getServer(target), ns.getPlayer())
    tthgw[1] = ns.formulas.hacking.growTime(ns.getServer(target), ns.getPlayer())
    tthgw[2] = ns.formulas.hacking.weakenTime(ns.getServer(target), ns.getPlayer())
    return tthgw
  }

}



export async function main(ns: NS) {
  //{hostname:'home', rammodifier:0.80}
  var deployManager = new ScriptDeployer(ns, [{hostname:'home',rammodifier:0.5}], { purchased: true })
  var hem = new HackExecutionManager(ns, deployManager);
  var until = Date.now() + 110000
  while (Date.now() > 0) {
    hem.uptick(ns)
    await ns.sleep(2100)
  }
}