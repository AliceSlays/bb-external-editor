
export function fetchServers(ns:NS){
    let servers = new Set<string>(['home'])
    servers.forEach(s => ns.scan(s).forEach(d=>servers.add(d)))
    return Array.from(servers)
}

export async function main(ns: NS) {
    console.log(fetchServers(ns))
}