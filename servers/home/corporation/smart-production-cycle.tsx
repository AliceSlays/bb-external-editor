




// calculates ammount of materials to buy
// creates command



// runtime, that handles the production cycle, by processing commands from other runtimes

export async function main(ns:NS){


    let prev = ns.corporation.getCorporation().nextState
    let current = ns.corporation.getCorporation().nextState
    while(true){


        prev = await ns.corporation.nextUpdate()
        current = ns.corporation.getCorporation().nextState
    }


}