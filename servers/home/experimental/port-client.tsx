import { fetchServers } from "../common/network-info"
import { IServerInfo } from "../common/common-types"
import { processServer, any_changes } from "../demons/network-info-demon"


export async function main(ns: NS) {
    while (true) {
        let response = ns.getPortHandle(11111)
        console.log(response.peek())
        await ns.sleep(10000)
    }
}