
import { fetchServerList } from '../dashboard/server-info.tsx';
import { ServerOption, ServerOptionList } from '../dashboard/dashboard-common.tsx';
import { HackActionCondition, HackPlanSingle, HackAction, HackActionTypeMeta, HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'


function postProcessActionThreads(action: HackAction) {
  //action.goal = action.goal;
  action.threads = action.threads > 0 ? action.threads : 0;
  action.ttwgh = action.threads > 0 ? action.ttwgh : 0;
  action.secdif = action.threads > 0 ? action.secdif : 0;
  // action.delay = action.delay;
  return action
}

function postProcessActionDelay(action: HackAction, prev: HackAction|undefined, delta_t: number = 2000) {
  if(prev===undefined){
    return action;
  }
  var finishPrev = prev.delay + delta_t + prev.ttwgh;
  action.delay = Math.floor(finishPrev - action.ttwgh);
  return action
}

function postProcessAction(action: HackAction, prev: HackAction|undefined, delta_t: number = 2000) {
  action = postProcessActionThreads(action);
  action = postProcessActionDelay(action, prev, delta_t);
  return action;
}

function initHackAction(ns: NS, goal: HackActionType, hostname: string, server: Server, player: Player, percentile: number = 0): HackAction {
  var baseAction = {
    goal: goal,
    threads: 0,
    ttwgh: 0,
    secdif: 0,
    delay: 0
  }
  switch (goal) {
    case HackActionType['W']: {
      baseAction.threads = Math.ceil(((server.hackDifficulty!) - server.minDifficulty!) / Math.abs(HackActionDifficulty[HackActionType[goal]]));
      var prev = server.hackDifficulty!;
      server.hackDifficulty = server.minDifficulty!;
      baseAction.ttwgh = ns.formulas.hacking.weakenTime(server, player);
      server.hackDifficulty = prev;
      baseAction.secdif = baseAction.threads * HackActionDifficulty[HackActionType[goal]];
      break;
    }
    case HackActionType['G']: {
      baseAction.threads = Math.ceil(ns.formulas.hacking.growThreads(server, player, server.moneyMax!));
      var prev = server.hackDifficulty!;
      server.hackDifficulty = server.minDifficulty!;
      baseAction.ttwgh = ns.formulas.hacking.growTime(server, player);
      server.hackDifficulty = prev;
      baseAction.secdif = HackActionDifficulty[HackActionType[goal]] * baseAction.threads, hostname;
      break;
    }
    case HackActionType['H']: {
      baseAction.threads = Math.ceil(percentile! / ns.formulas.hacking.hackPercent(server, player));
      var prev = server.hackDifficulty!;
      server.hackDifficulty = server.minDifficulty!;
      baseAction.ttwgh = ns.formulas.hacking.hackTime(server, player);
      server.hackDifficulty = prev;
      baseAction.secdif = HackActionDifficulty[HackActionType[goal]] * baseAction.threads;
      break;
    }
    default: {
      break;
    }
  }
  return baseAction;
}

function initHackPlanSingleWGWHS(ns: NS, hostname: string, percentile: number, w1: HackAction, g1: HackAction, w2: HackAction, h1: HackAction): HackPlanSingle {
  var plan: HackPlanSingle = {
    hostname: hostname,
    percentile: percentile,
    weaken1: w1,
    grow1: g1,
    weaken2: w2,
    hack1: h1,
  }
  var offset = Math.min(w1.delay, g1.delay, w2.delay, h1.delay);
  // should be always 0 or lower, but just in case
  if (offset > 0) {
    offset = 0;
  } else {
    offset *= -1;
  }
  plan = doOffsetDelay(plan, offset);
  return plan;
}

function doOffsetDelay(plan: HackPlanSingle, offset: number) {
  plan.weaken1.delay += offset;
  plan.grow1.delay += offset;
  plan.weaken2.delay += offset;
  plan.hack1.delay += offset;
  return plan
}

export function createHackPlanSingleWGWHS(ns: NS, hostname: string, percentile: number, delta_t: number = 1000): HackPlanSingle {
  // step 1
  var server = ns.getServer(hostname);
  var player = ns.getPlayer();

  // circle thing

  var h0 = initHackAction(ns, HackActionType['H'], hostname, server, player, percentile);
  h0 = postProcessAction(h0, undefined, delta_t);

  server.hackDifficulty! += h0.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;
  server.moneyAvailable! *= (1 - percentile);

  var w1 = initHackAction(ns, HackActionType['W'], hostname, server, player, percentile);
  w1 = postProcessAction(w1, undefined, delta_t);

  server.hackDifficulty! += w1.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;

  var g1 = initHackAction(ns, HackActionType['G'], hostname, server, player, percentile);
  g1 = postProcessAction(g1, w1, delta_t);

  server.hackDifficulty! += g1.secdif;
  server.moneyAvailable = server.moneyMax!;

  var w2 = initHackAction(ns, HackActionType['W'], hostname, server, player, percentile);
  w2 = postProcessAction(w2, g1, delta_t);
  server.hackDifficulty! += w2.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;

  var h1 = initHackAction(ns, HackActionType['H'], hostname, server, player, percentile);
  h1 = postProcessAction(h1, w2, delta_t);


  var plan = initHackPlanSingleWGWHS(ns, hostname, percentile, w1, g1, w2, h1);
  return plan;
}



// i need to switch at every full circle of the shortest goal

function deployAction(ns: NS, action: HackAction, serverOptionList: ServerOptionList, target: string) {
  if (action.goal === undefined) {
    return 0
  }
  const filename = HackActionFiles[action.goal];

  var count = 0;
  serverOptionList.forEach(server => {
    count += deployOnServer(ns, filename, action.threads - count, server, false, target)
  })
  console.log(`Staged ${count} '${action.goal}' threads from ${action.threads}`)
  return count == action.threads ? action.threads : count
}

function deployOnServer(ns: NS, filename: string, threads: number, server: ServerOption, killprev_flag: boolean = false, target: string) {
  if (!ns.fileExists(filename)) {
    return 0;
  }
  if (threads == 0) {
    return 0;
  }
  if (killprev_flag) {
    ns.scriptKill(filename, server.hostname)
  }
  ns.scp(filename, server.hostname, 'home');
  const scriptRamCost: number = ns.getScriptRam(filename, 'home');
  const serverRamFree: number = server.rammodifier ? (ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname)) * server.rammodifier :
    (ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname));

  const threadsPossible: number = Math.floor(serverRamFree / scriptRamCost);
  const threadsToRun: number = threadsPossible < threads ? threadsPossible : threads;
  if (threadsToRun == 0) {
    return 0;
  }
  ns.exec(filename, server.hostname, { temporary: false, threads: threadsToRun }, target)
  return threadsToRun;
}

function is_ServerIdeal(ns: NS, hostname: string) {
  var server = ns.getServer(hostname);
  var player = ns.getPlayer();

  if (!server.moneyMax) {
    return false;
  }
  if (!server.moneyAvailable) {
    return false;
  }
  if (!server.hackDifficulty) {
    return false;
  }
  if (!server.minDifficulty) {
    return false;
  }
  if (!server.hasAdminRights) {
    return false;
  }
  if (!server.requiredHackingSkill) {
    return false;
  }

  if (server.requiredHackingSkill > player.skills.hacking) {
    return false;
  }
  if (server.moneyMax > server.moneyAvailable) {
    return false;
  }
  if (server.hackDifficulty > server.minDifficulty) {
    return false;
  }
  return true;

}


function getHackActionRuntime(ns: NS, action: HackAction, hostname: string): number {
  var server = ns.getServer(hostname);
  var player = ns.getPlayer();
  var execution_time = 0;
  switch (action.goal) {
    case HackActionType['W']: {
      execution_time = ns.formulas.hacking.weakenTime(server, player);
      break;
    }
    case HackActionType['G']: {
      execution_time = ns.formulas.hacking.growTime(server, player);
      break;
    }
    case HackActionType['H']: {
      execution_time = ns.formulas.hacking.hackTime(server, player);
      break;
    }
    default: {
      break;
    }
  }
  return execution_time;
}


function is_ActionAligning(ns: NS, action: HackAction, hostname: string, window: { start: number, end: number }): boolean {
  var ex_time = getHackActionRuntime(ns, action, hostname);
  var finish_time = Date.now() + ex_time;
  if (window.start < finish_time && finish_time < window.end) {
    return true;
  }
  return false;
}
// w,w,w,w,w,w,w,g,w,g,w,g,w,g,w,g,w,g,h,w,g,w,h
// plan has finish slots
// w,g,w,h,s,s,s,s,s,w,g,w,h,
function targetServer(ns: NS, plan: HackPlanSingle) {
  if (!is_ServerIdeal(ns, plan.hostname)) {
    return;
  }
}

export async function main(ns: NS) {
  var plan1 = createHackPlanSingleWGWHS(ns, "nwo", 0.6, 1000)
  //await prepareServer(ns, "nwo")
  console.log(plan1)
  var tickrate = 200; // check if action possible per
  var threadrate = tickrate * 5; // deploy one action once per
  var hackrate = threadrate * 10; // hack once per

  var hackedServerList = ns.getPurchasedServers().filter((server) => server != 'home');
  var hackedServerOptionList: ServerOptionList = hackedServerList.map(server => { return { hostname: server, rammodifier: 1 } })
  deployAction(ns, plan1.weaken1, hackedServerOptionList, 'kuai-gong')



  const func = async function () {
    while (true) {



      await ns.asleep(tickrate)
    }
  }
  /*
  pre=> store threads
  every tick check if a command can be executed
  verify if server in perfect condition for execution
  verify if command end aligns with a thread/hackplan // concurent threads
  
  
  if both ok, execute command
  
  */


  //while (true) {




  // await ns.asleep(tickrate)
  //}


}