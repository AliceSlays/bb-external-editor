
var cache=new Map<string,number>()

function find_all_sums_of(target:number, factors:number[], starting_index:number){
    //console.log(target, starting_index)
    var count=starting_index
    var sum=0
    if(cache.get(`f(${target},${starting_index}`)){
        return cache.get(`f(${target},${starting_index}`)!
    }
    while(count<factors.length){
        if(target-factors[count] < 0){
            count++
            continue
        }
        if(target-factors[count]==0){
            sum=sum+1
        }
        if(target-factors[count]>0){

            sum=sum+find_all_sums_of(target-factors[count],factors,count)
        }
        count++
    }
    cache.set(`f(${target},${starting_index}`,sum)
    //console.log(`f(${target},${starting_index}) = ${sum}`)
    return sum
}





export async function main(ns: NS) {
var set_of_nums =[1,2,4,6,7,9,11,12,14]
var target = 152

console.log(find_all_sums_of(target, set_of_nums,0))

}