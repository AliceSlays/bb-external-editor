import { fetchServers } from "../common/network-info"
import { IServerInfo } from "../common/common-types"
import { processServer, any_changes } from "../common/network-info-demon"


export async function main(ns: NS) {
    let servers = fetchServers(ns)
    let processed = servers.map(s => { return processServer(ns, s) })
    let prev = processed;

    while (true) {
        servers = fetchServers(ns)
        processed = servers.map(s => { return processServer(ns, s) })
        let current = processed
        if (any_changes(prev, current.concat(prev[0]))) {
            try {
                ns.tryWritePort(11111, processed)
            } catch (e) {
                console.log(e)
            }
        }
        await ns.sleep(1000)
    }
}