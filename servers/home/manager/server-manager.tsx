import type {NetscriptPort} from "NetscriptDefinitions"

export class ServerManager{
    portHandle:NetscriptPort


    constructor(ns:NS, portHandle?:NetscriptPort){
      if(portHandle){
        this.portHandle = portHandle
      }
    }


}

