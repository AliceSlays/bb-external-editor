/** @param {NS} ns */
export async function main(ns) {
  // network exploration
  // autohack
  if (ns.getHostname() != 'home') {
    ns.tprint(`${ns.getScriptName()} needs to run on \"home\" instead of ${ns.getHostname()}`);
    return;
  }

  // get server list and their hacking levels
  // filter already with backdooraccess
  // for gaming purposes limit exploration by hacking level, dont go past higher level servers or servers without backdoors
  // reexplore on hacking level increase

  // scan -> check hacking level, ownership, nuke and backdoor status -> if hacked -> scan
  //                                                                     else if ok hack
  //                                                                     else continue to another
  // can i do recursively?

  function recursiveExploration(to_explore, player_hacking_level, parent = "") {
    var server = ns.getServer(to_explore);
    if (server.purchasedByPlayer) {
      if (server.hostname != "home") {
        return [];
      }
    }
    //var pHackingLevelReq = ns.getServerRequiredHackingLevel(to_explore);
    if (server.requiredHackingSkill > player_hacking_level) {
      return [];
    }
    if (ns.fileExists("BruteSSH.exe", "home")) {
      //ns.tprint(`${to_explore} SSH Port Status ${server.sshPortOpen}`);
      if (!server.sshPortOpen) {
        ns.brutessh(to_explore);
        ns.tprint(`Opened SSH Port on ${to_explore}.`);
      }
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
      if (!server.ftpPortOpen) {
        ns.ftpcrack(to_explore);
        ns.tprint(`Opened FTP Port on ${to_explore}.`);
      }
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
      if (!server.smtpPortOpen) {
        ns.relaysmtp(to_explore);
        ns.tprint(`Opened SMTP Port on ${to_explore}.`);
      }
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
      if (!server.httpPortOpen) {
        ns.httpworm(to_explore);
        ns.tprint(`Opened HTTP Port on ${to_explore}.`);
      }
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
      if (!server.sqlPortOpen) {
        ns.sqlinject(to_explore);
        ns.tprint(`Opened SQL Port on ${to_explore}.`);
      }
    }
    server = ns.getServer(to_explore);
    if (!server.hasAdminRights) {
      if (server.numOpenPortsRequired <= server.openPortCount) {
        ns.nuke(to_explore);
        ns.tprint(`${to_explore} NUKED!!!`);
      } else {
        return []; // not enough programs to continue
      }
    }
    server = ns.getServer(to_explore);
    //if (!server.backdoorInstalled) {
    //  if (server.hasAdminRights) {
    //    ns.singularity.connect(to_explore);
    //    ns.singularity.installBackdoor();
    //    ns.singularity.connect("home");
    //    ns.tprint(`Backdoor on ${to_explore} Installed!!!`);
    //  }
    //}

    var availableServers = [];

    var children = ns.scan(to_explore);
    for (var child of children) {
      if (child != parent) {
        availableServers = availableServers.concat(recursiveExploration(child, player_hacking_level, to_explore));
      }
    }
    return [[to_explore, server.requiredHackingSkill]].concat(availableServers);
  }

  var vPlayerHackingLevel = ns.getHackingLevel() - 1;
  var serverList = [];
  while (true) {
    if (ns.getHackingLevel() > vPlayerHackingLevel) {
      vPlayerHackingLevel = ns.getHackingLevel()
      var serverExplored = await recursiveExploration("home", vPlayerHackingLevel);
      
      var newlyDiscovered = [];
      for(var explored of serverExplored){
        var found = serverList.filter((x)=>x[0]==explored[0]) ||[];
        if (found.length==0){
          newlyDiscovered.push(explored);
        }
      }
      serverList = serverExplored;
      if(newlyDiscovered.length > 0){
        ns.tprint("New Servers Discovered!");
        ns.tprint(newlyDiscovered);
      }
      
    }
    await ns.sleep(60000);
  }
  ns.tprint(serverList.length);
  ns.tprint(serverList);


}