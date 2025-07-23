export interface IServerInfo{
    name:string,
    owned:boolean,
    nuked:boolean,
    hackLevel:number|undefined,
    maxRam:number|undefined,
    maxMoney:number|undefined,
    minSecurity:number|undefined,

}

export enum EPortNumber{
    N = 11111       // network info crawler

}