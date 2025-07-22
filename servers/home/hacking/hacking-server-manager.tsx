
import { ServerList, ServerOption, ServerOptionList } from '../dashboard/dashboard-common.tsx';
import { fetchServerList } from '../dashboard/server-info.tsx';
import { HackActionFiles } from '../hacking/hacking-common.tsx'

export interface ScriptArgs {
  fileName: string,
  args: string[]
}
export class ScriptDeployer {
  startup: { include_servers: ServerOptionList, props: { home?: boolean, purchased?: boolean, hacked?: boolean } }
  servers: ServerOptionList = [];

  constructor(ns: NS, include_servers: ServerOptionList = [], props: { home?: boolean, purchased?: boolean, hacked?: boolean } = { home: false, purchased: false, hacked: false }) {
    this.startup = { include_servers: include_servers, props: props }
    this.servers = include_servers;
    if (props.home) {
      this.servers.push({ hostname: 'home', rammodifier: 0.95 })
    }
    if (props.purchased) {
      this.servers.push(...ns.getPurchasedServers().map(host => { return { hostname: host, rammodifier: 1 } }))
    }
    if (props.hacked) {
      var hackedServerList: ServerList = fetchServerList(ns);
      hackedServerList = hackedServerList.filter((server) => server.hostname != 'home');
      hackedServerList = hackedServerList.filter((server) => server.stats?.maxRam ? server.stats.maxRam > 0 : false);
      hackedServerList = hackedServerList.filter((server) => server.stats?.hasAdminRights ? server.stats.hasAdminRights : false);
      var hackedServerOptionList: ServerOptionList = hackedServerList.map(server => { return { hostname: server.hostname, rammodifier: 1 } })
      this.servers.push(...hackedServerOptionList);
    }
    console.log(this.servers.map(server => server.hostname))
  }

  updateServerList(ns: NS) {
    this.servers = this.startup.include_servers;
    if (this.startup.props.home) {
      this.servers.push({ hostname: 'home', rammodifier: 0.5 })
    }
    if (this.startup.props.purchased) {
      this.servers.push(...ns.getPurchasedServers().map(host => { return { hostname: host, rammodifier: 1 } }))
    }
    if (this.startup.props.hacked) {
      var hackedServerList: ServerList = fetchServerList(ns);
      hackedServerList = hackedServerList.filter((server) => server.hostname != 'home');
      hackedServerList = hackedServerList.filter((server) => server.stats?.maxRam ? server.stats.maxRam > 0 : false);
      hackedServerList = hackedServerList.filter((server) => server.stats?.hasAdminRights ? server.stats.hasAdminRights : false);
      var hackedServerOptionList: ServerOptionList = hackedServerList.map(server => { return { hostname: server.hostname, rammodifier: 1 } })
      this.servers.push(...hackedServerOptionList);
    }
  }


  deployScriptOnServer(ns: NS, script: ScriptArgs, server: ServerOption, threads: number, temporary: boolean = true, deploy: boolean = true): number {
    if (!ns.fileExists(script.fileName)) {
      return 0;
    }
    ns.scp(script.fileName, server.hostname, 'home');
    const scriptRamCost: number = ns.getScriptRam(script.fileName, 'home');
    var serverRamFree: number = server.rammodifier ? (ns.getServerMaxRam(server.hostname) * server.rammodifier - ns.getServerUsedRam(server.hostname)) :
      (ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname));
    if (serverRamFree < 0){
      serverRamFree = 0
    }
    const threadsPossible: number = Math.floor(serverRamFree / scriptRamCost);
    const threadsToRun: number = threadsPossible >= threads ? threads : threadsPossible;
    if (threadsToRun > 0) {
      if (deploy) {
        //if(threadsToRun > 100000){
        //console.log('tt', script.fileName, script.args,threadsToRun, threadsPossible, threads, serverRamFree)
        //}
        ns.exec(script.fileName, server.hostname, { temporary: temporary, threads: threadsToRun }, ...script.args, 't', threadsToRun)
      }
    }
    return threadsToRun;
  }

  deployScriptBatch(ns: NS, script: ScriptArgs, threads: number, temporary: boolean = true, deploy: boolean = true) {
    if (threads <= 0) {
      //console.log('low threads',threads, script)
      return 0
    }
    var threadsDeployed: number = 0;
    this.servers.forEach(server => {
      if (threadsDeployed < threads) {
        const threadsToDeploy = threads - threadsDeployed;
        threadsDeployed += this.deployScriptOnServer(ns, script, server, threadsToDeploy, temporary, deploy);
      }
    })
    return threadsDeployed;
  }

  can_deploy_threads(ns: NS, script: ScriptArgs, threads: number) {
    return this.deployScriptBatch(ns, script, threads, true, false)
  }
}






export async function main(ns: NS) {
  var scriptdeployer = new ScriptDeployer(ns, [{ hostname: 'pserv-24', rammodifier: 1 }, { hostname: 'pserv-23', rammodifier: 1 },
  { hostname: 'pserv-22', rammodifier: 1 }, { hostname: 'pserv-21', rammodifier: 1 },
  { hostname: 'pserv-20', rammodifier: 1 }, { hostname: 'pserv-19', rammodifier: 1 },
  { hostname: 'pserv-18', rammodifier: 1 }, { hostname: 'pserv-17', rammodifier: 1 },
  { hostname: 'pserv-16', rammodifier: 1 }, { hostname: 'pserv-15', rammodifier: 1 },
  { hostname: 'pserv-14', rammodifier: 1 }, { hostname: 'pserv-13', rammodifier: 1 },
  { hostname: 'pserv-12', rammodifier: 1 }, { hostname: 'pserv-11', rammodifier: 1 },
  { hostname: 'pserv-10', rammodifier: 1 }, { hostname: 'pserv-9', rammodifier: 1 },
  { hostname: 'pserv-8', rammodifier: 1 }, { hostname: 'pserv-7', rammodifier: 1 },
    // {hostname:'pserv-6',rammodifier:1},{hostname:'pserv-5',rammodifier:1}
  ], { hacked: true })
  var filename = 'hacking/hacking-server-share.tsx';
  var count = scriptdeployer.deployScriptBatch(ns, { fileName: filename, args: [] }, 9999999, false)
  console.log(`Deployed ${count} share threads!`)
}