
import { ScriptDeployer } from '../hacking/hacking-server-manager.tsx'

export async function main(ns: NS) {
  const filename = 'hacking/hacking-server-share.tsx'
  var scriptDeployer = new ScriptDeployer(ns, [], { hacked: true })
  var count = scriptDeployer.deployScriptBatch(ns, { fileName: filename, args: [] }, 99999, true, true)
  console.log(`Deployed ${count} threads!`);

  while (true) {
    scriptDeployer.updateServerList(ns, [], { hacked: true })
    var count = scriptDeployer.deployScriptBatch(ns, { fileName: filename, args: [] }, 99999, true, true)
    await ns.sleep(600000)
  }
}