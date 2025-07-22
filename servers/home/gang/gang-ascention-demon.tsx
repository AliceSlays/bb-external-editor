export async function main(ns: NS) {
  if(!ns.gang.inGang()){
    ns.tprintf("Not in gang!")
    return
  }

  function ascention_condition_1(ns:NS, member:string):boolean{
    var info = ns.gang.getMemberInformation(member)
    return false
  }

  while(true){

    var members = ns.gang.getMemberNames()


    await ns.sleep(1000)
  }

}