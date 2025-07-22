// hack a specific target
// need virtual ram and script deploy
import { fetchServerList } from '../dashboard/server-info.tsx';
import { ServerListItem, ServerList, ServerOption, ServerOptionList } from '../dashboard/dashboard-common.tsx';
import { HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'
import { HackPlanManager } from '../hacking/hacking-planmanager.tsx'
import { ScriptDeployer } from '../hacking/hacking-server-manager.tsx'


function queryHackActionTime(ns: NS, actionType: HackActionType, target: string): number {
  var player = ns.getPlayer();
  var server = ns.getServer(target);
  var ttwgh;
  switch (actionType) {
    case HackActionType['W']: { // 'W'
      ttwgh = ns.formulas.hacking.weakenTime(server, player)
      break;
    }
    case HackActionType['G']: { // 'G'
      ttwgh = ns.formulas.hacking.growTime(server, player)
      break;
    }
    case HackActionType['H']: { // 'W'
      ttwgh = ns.formulas.hacking.hackTime(server, player)
      break;
    }
    default: {
      console.log(`${actionType} has no execution time.`)
      return 0;
    }
  }
  return ttwgh
}

function queryHackActionThreads(ns: NS, target: string, percentile: number, pos: number) {
  var player = ns.getPlayer();
  var server = ns.getServer(target);
  var threads;
  switch (pos) {
    case 0: { // W
      var mock_server = server;
      mock_server.moneyAvailable = mock_server.moneyMax;
      var secdiff = ns.hackAnalyzeSecurity(Math.ceil(percentile / ns.formulas.hacking.hackPercent(server, player)),target) ;
      //var secdiff =  HackActionDifficulty[HackActionType['H']] * Math.ceil(percentile / ns.formulas.hacking.hackPercent(server, player));
      secdiff += server.hackDifficulty! - server.minDifficulty!;
      threads = Math.ceil(secdiff / -HackActionDifficulty[HackActionType['W']])
      break;
    }
    case 1: { // G
      var mock_server = server;
      var money = mock_server.moneyMax! * (1 - percentile);
      mock_server.moneyAvailable = money > mock_server.moneyAvailable! ? mock_server.moneyAvailable! : money;
      threads = Math.ceil(ns.formulas.hacking.growThreads(server, player, server.moneyMax!));
      break;
    }
    case 2: { // W
      var mock_server = server;
      var money = mock_server.moneyMax! * (1 - percentile);
      mock_server.moneyAvailable = money > mock_server.moneyAvailable! ? mock_server.moneyAvailable! : money;
      var secdiff = HackActionDifficulty[HackActionType['G']] * Math.ceil(ns.formulas.hacking.growThreads(server, player, server.moneyMax!));
      secdiff += server.hackDifficulty! - server.minDifficulty!;
      threads = Math.ceil(secdiff / -HackActionDifficulty[HackActionType['W']])
      break;
    }
    case 3: { // H
      var mock_server = server;
      mock_server.moneyAvailable = mock_server.moneyMax;
      threads = Math.ceil(percentile / ns.formulas.hacking.hackPercent(server, player));
      var chance_factor = ns.formulas.hacking.hackChance(server, player)
      //threads = Math.ceil(threads * 10**(2-chance_factor))
      break;
    }
    default: {
      console.log(`ERROR: queryHackActionThreads ${pos}`)
      return 0;
    }
  }
  return threads
}

function is_optimal(ns:NS, target:string){
  var server=ns.getServer(target)
  if(server.minDifficulty==server.hackDifficulty){
    return true;
  }
  return false
}
function execute(ns: NS, deployManager: ScriptDeployer, planmanager: HackPlanManager, hack_percent: number, pattern: HackActionType[]) {
  planmanager.uptick();
  var ttwgwh = pattern.map(hat => queryHackActionTime(ns, hat, planmanager.target))
  // what can i do, 
  var threads = pattern.map((hat, index) => queryHackActionThreads(ns, planmanager.target, hack_percent, index))
  pattern.forEach((act, index) => {
      console.log('plan',ns.getServer(planmanager.target).hackDifficulty!)
    if (planmanager.can_deploy(act, ttwgwh[index], index)
      && deployManager.can_deploy_threads(ns, { fileName: HackActionFiles[act], args: [planmanager.target] }, threads[index]) == threads[index]
      && (is_optimal(ns,planmanager.target) || act==HackActionType['W'])
    ) {
      deployManager.deployScriptBatch(ns, { fileName: HackActionFiles[act], args: [planmanager.target] }, threads[index])
      planmanager.deploy_action(act, ttwgwh[index], index, threads[index])
      console.log('deployed action', planmanager.getPlanPos(ttwgwh[index]) ,act, index, threads[index], ttwgwh[index])
    }
  })
  return planmanager
}







export async function main(ns: NS) {
  var target = 'rho-construction'
  var deployManager = new ScriptDeployer(ns, [], { purchased: true })
  console.log(deployManager.servers.length)
  var planManager = new HackPlanManager(target,26321)
  var plan_pattern = [HackActionType['W'], HackActionType['G'], HackActionType['W'], HackActionType['H']];
  var tickrate = 451;
  console.log(planManager.target)
  var do_time = Date.now() + 3600000;
  while (Date.now() > 0) {
    planManager = execute(ns, deployManager, planManager, 1, plan_pattern)
    await ns.sleep(tickrate)

  }
  console.log('finished')
}