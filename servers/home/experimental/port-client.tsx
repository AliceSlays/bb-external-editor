
import { IServerInfo } from "../common/common-types"


export async function main(ns: NS) {
    while (true) {
        let response = ns.getPortHandle(11111)
        console.log(response.peek())
        await ns.sleep(200)
    }
}