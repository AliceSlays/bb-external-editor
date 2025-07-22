
function transaction(arr:number[]){
    if(arr.length <= 1){
        return undefined
    }
    var diff = undefined;
    var count=arr.length-1
    while(count > 0){
        var split = count
        var min_l = Math.min(...arr.slice(0,split))
        var max_r = Math.max(...arr.slice(split,))
        if(min_l && max_r){
            if(diff === undefined){
                diff = max_r-min_l
            }
            diff = Math.max(diff, max_r-min_l)
        }
        count--
    }
    return diff
}

function lr_t(arr:number[]){
    var trans = transaction(arr)
    if(trans===undefined){
        return undefined
    }
    var trans_l
    var trans_r
    var count = 0
    while(count < arr.length-1){
        var split = count
        var nl = transaction(arr.slice(0,split))
        var nr = transaction(arr.slice(split,))
        if(nl!==undefined && nr!==undefined){
            if(trans_l===undefined || trans_r===undefined){
                trans_l = nl
                trans_r = nr
            }
            if(nl+nr > trans_l+trans_r){
            trans_l = nl
            trans_r = nr
            }
        }
        count++
    }
    return [trans, trans_l,trans_r, trans_l+trans_r]
}


function many_t(arr:number[]){
    var trarr = []

    var from_last = 0
    var prev_tra = 0
    var count = 0
    while(count < arr.length){
        var split = count
        var tra = transaction(arr.slice(from_last, split))
        if(tra!== undefined){
            if(tra == prev_tra){
                trarr.push(prev_tra)
                from_last=count - 1
            } 
            prev_tra=tra
        }
        count++
    }
    console.log(trarr)
    trarr=trarr.filter(ar=>ar>0)
    return trarr.reduce((sum,tra)=>{return sum+tra},0)
}
export async function main(ns: NS) {
var list_of_nums =[6,147,46,105,42,156,117,145,79,65,115,94,98,162,1,187,187,97,108,175,155,120,40,103,55,6,116,17,169,118,3,188,87,15,109,89,101,11,156,190,37,192,122,148,103,55,174,84,132,85]


console.log(lr_t(list_of_nums))
console.log(many_t(list_of_nums.concat([0])))

}