import { EPortNumber, IServerInfo } from "../common/common-types"



//import {fetchServerListFromDemon} from '../actions/network-info.ts'
export function fetchServerListFromDemon(ns:NS):IServerInfo[] | undefined{

    let portHandle = ns.getPortHandle(EPortNumber.N);
    let res = portHandle.peek()

    return res
    
}