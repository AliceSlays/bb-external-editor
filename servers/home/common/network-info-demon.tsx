import { fetchServers } from "../common/network-info"
import { IServerInfo } from "../common/common-types"


export function processServer(ns: NS, target: string): IServerInfo {
    let server = ns.getServer(target)
    return {
        name: server.hostname,
        owned: server.purchasedByPlayer,
        nuked: server.hasAdminRights,
        hackLevel: server.requiredHackingSkill,
        maxRam: server.maxRam,
        maxMoney: server.moneyMax,
        minSecurity: server.minDifficulty,

    }
}

export function has_changed(prev: IServerInfo, current: IServerInfo): boolean {
    return !(
        prev.nuked && current.nuked
    )
}

export function any_changes(prev: IServerInfo[], current: IServerInfo[]): boolean {
    if (prev.length != current.length) {
        return true
    }

    prev.forEach((p, i) => {
        if (!(p.nuked && current[i].nuked)) {
            return true
        }
    })
    return false
}


export async function main(ns: NS) {
    let servers = fetchServers(ns)
    let processed = servers.map(s => { return processServer(ns, s) })
    let current = processed;
    let port = ns.getPortHandle(11111)
    port.write(current)
    console.log('initial state',port.peek())
    while (true) {
        servers = fetchServers(ns) // somtimes parts of network are unlocked later
        let follow = servers.map(s => { return processServer(ns, s) })
        if (any_changes(current, follow)) {
            try {
                port.tryWrite(follow)
            } catch (e) {
                console.log(e)
            }
        }
        current = follow
        await ns.sleep(1000)
    }
}