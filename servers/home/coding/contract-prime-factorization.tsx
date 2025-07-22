function is_divisor(val:number, div:number){
    return (val/div) % 1 == 0 
}


function next_factor(val:number, factors:number[]){
    var count=2;
    while(count < val){
        if(is_divisor(val,count)){
            return next_factor(val/count, [...factors,count])
        }
        count++
    }
    return [val,...factors]
}


export async function main(ns: NS) {
  var num = 306415074
  var factors = next_factor(num,[])
console.log(`Max Factor: ${Math.max(...factors)}, Factors: ${factors}` )
}