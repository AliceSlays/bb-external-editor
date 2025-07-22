

interface HackPlanSingle {
  hostname: string,
  percentile: number,
  weaken1: HackAction,
  grow1: HackAction,
  weaken2: HackAction,
  hack1: HackAction,
  sleep1: HackAction
}

interface HackAction {
  goal: string,
  threads: number,
  ttwgh: number,
  secdif: number,
  delay: number
}

function postProcessActionThreads(action: HackAction) {
  //action.goal = action.goal;
  action.threads = action.threads > 0 ? action.threads : 0;
  action.ttwgh = action.threads > 0 ? action.ttwgh : 0;
  action.secdif = action.threads > 0 ? action.secdif : 0;
  // action.delay = action.delay;
  return action
}

function postProcessActionDelay(action: HackAction, prev: HackAction, delta_t: number = 2000) {
  var finishPrev = prev.delay + delta_t + prev.ttwgh;
  action.delay = Math.floor(finishPrev - action.ttwgh);
  return action
}

function postProcessAction(action: HackAction, prev: HackAction, delta_t: number = 2000) {
  action = postProcessActionThreads(action);
  action = postProcessActionDelay(action, prev, delta_t);
  return action;
}

const sechack = 0.002;
const secweaken = 0.05;
const secgrowth = 0.004;

function initHackAction(ns: NS, goal: string, hostname: string, server: Server, player: Player, percentile: number = 0): HackAction {
  var baseAction = {
    goal: goal,
    threads: 0,
    ttwgh: 0,
    secdif: 0,
    delay: 0
  }
  switch (goal) {
    case 'W': {
      baseAction.threads = 1;
      baseAction.ttwgh = 99799;
      break;
    }
    case 'G': {
      baseAction.threads = 1;
      baseAction.ttwgh = 55755;
      break;
    }
    case 'H': {
      baseAction.threads = 1;
      baseAction.ttwgh = 22335;
      break;
    }
    case 'S': {
      break;
    }
    default: {
      break;
    }
  }
  return baseAction;
}

function initHackPlanSingleWGWHS(ns: NS, hostname: string, percentile: number, w1: HackAction, g1: HackAction, w2: HackAction, h1: HackAction, s1: HackAction): HackPlanSingle {
  var offset = Math.min(w1.delay, g1.delay, w2.delay, h1.delay);
  // should be always 0 or lower, but just in case
  if (offset > 0) {
    offset = 0;
  } else {
    offset *= -1;
  }

  var plan: HackPlanSingle = {
    hostname: hostname,
    percentile: percentile,
    weaken1: w1,
    grow1: g1,
    weaken2: w2,
    hack1: h1,
    sleep1: s1
  }
  plan = doOffset(plan, offset)
  return plan;
}

function doOffset(plan: HackPlanSingle, offset: number) {
  plan.weaken1.delay += offset;
  plan.grow1.delay += offset;
  plan.weaken2.delay += offset;
  plan.hack1.delay += offset;
  plan.sleep1.delay += offset;
  return plan;
}

function createHackPlanSingleWGWHS(ns: NS, hostname: string, percentile: number, delta_t: number = 1000, offset: number): HackPlanSingle {
  // step 1
  var server = ns.getServer(hostname);
  var player = ns.getPlayer();
  var baseAction = initHackAction(ns, '', hostname, ns.getServer(), ns.getPlayer(), percentile);

  // circle thing

  var h0 = initHackAction(ns, 'H', hostname, server, player, percentile);
  h0 = postProcessAction(h0, baseAction, delta_t);

  server.hackDifficulty! += h0.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;
  server.moneyAvailable! *= (1 - percentile);

  var w1 = initHackAction(ns, 'W', hostname, server, player, percentile);
  w1 = postProcessAction(w1, baseAction, delta_t);

  server.hackDifficulty! += w1.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;

  var g1 = initHackAction(ns, 'G', hostname, server, player, percentile);
  g1 = postProcessAction(g1, w1, delta_t);

  server.hackDifficulty! += g1.secdif;
  server.moneyAvailable = server.moneyMax!;

  var w2 = initHackAction(ns, 'W', hostname, server, player, percentile);
  w2 = postProcessAction(w2, g1, delta_t);
  server.hackDifficulty! += w2.secdif;
  server.hackDifficulty! = server.hackDifficulty! < server.minDifficulty! ? server.minDifficulty! : server.hackDifficulty!;

  var h1 = initHackAction(ns, 'H', hostname, server, player, percentile);
  h1 = postProcessAction(h1, w2, delta_t);


  var s1 = initHackAction(ns, 'S', hostname, server, player, percentile);
  s1.threads = 1;
  s1.ttwgh = delta_t * 5;
  s1 = postProcessAction(s1, h1, delta_t);

  var plan = initHackPlanSingleWGWHS(ns, hostname, percentile, w1, g1, w2, h1, s1);
  plan=doOffset(plan,offset)
  return plan;
}


async function ccc(ns: NS, goal: string, delta: number) {
  console.log(goal + ' start', gimmeDate())
  await ns.asleep(delta)
  console.log(goal + ' end', gimmeDate())

}

function gimmeDate() {
  return Date().toString().slice("Mon Jul 07 2025 ".length, "Mon Jul 07 2025 ".length + "22:23:12".length) + ':' + (Date.now() % 1000).toString()
}
// write scheduler with takt in rythm of shortest timer
// cycle and cycle offset
// length of the cycle determined by shortest timer
// can ram be reserved?
export async function main(ns: NS) {
  var tickrate = 1000;
  var name = ns.getScriptName();
  var plan = createHackPlanSingleWGWHS(ns, "nwo", 0.6, 1000,0)
  //await prepareServer(ns, "nwo")
  console.log(plan)

  var turnover = Math.floor(plan.hack1.ttwgh / tickrate);

  var tid1 = setInterval(() => {
    console.log('tik ', gimmeDate());
    try {
      if (!ns.scriptRunning(name, 'home')) {
        clearInterval(tid1);
      }
    } catch {
      clearInterval(tid1);
    }
  }, tickrate * 10);
  await ns.sleep(tickrate * 5);
  var tid2 = setInterval(() => {
    console.log('tok ', gimmeDate());
    try {
      if (!ns.scriptRunning(name, 'home')) {
        clearInterval(tid2);
      }
    } catch {
      clearInterval(tid2);
    }
  }, tickrate * 10);

  var endAction: HackAction;
  var lastPlan: HackPlanSingle = plan;

  endAction = plan.hack1;


  var date_start = Date.now();

  var count = 0;

  var count_p=0;
  var many_plans:HackPlanSingle[];
  while (count < 200) {
    var plan1 = createHackPlanSingleWGWHS(ns, "nwo", 0.6, 1000,(count_p+1)*tickrate*10)
    var is_valid = plan1.weaken1.delay + plan1.weaken1.ttwgh + tickrate > plan.hack1.delay + plan.hack1.ttwgh + tickrate * 5
    if (is_valid) {
      count_p++
      //start plan1
      // push plan1 to many_plans
      // check if server in optimal -> act
      // check if act after command
      
    }

  // in parallel interval execute next command in spot
    count++
    await ns.asleep(tickrate)

  }

  clearTimeout(tid1)
  clearTimeout(tid2)
}

/*
every tick check if a command can be executed
verify if server in perfect condition for execution
verify if command end aligns with a thread/hackplan // concurent threads


if both ok, execute command

*/