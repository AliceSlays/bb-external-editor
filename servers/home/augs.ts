export async function main(ns: NS) {
var augs=ns.singularity.getAugmentationsFromFaction('Daedalus')
while(true){
augs.forEach(a=>{ns.singularity.purchaseAugmentation('Daedalus',a)})
await ns.sleep(400)
}
}