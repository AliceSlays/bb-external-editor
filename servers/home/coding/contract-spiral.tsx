// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A location to learn TypeScript where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript


interface IDir{
    row:number,
    col:number
}

enum EDirection{
    right='right',
    down='down',
    left='left',
    up='up'
}

function go_dir(edir:EDirection, ccol:number, crow:number){
    var nc=0;
    var nr=0;
    switch(edir){
        case EDirection.right:{
            nc = ccol+1
            nr = crow
            break;
        }
        case EDirection.down:{
            nc = ccol
            nr = crow+1
            break;
        }
        case EDirection.left:{
            nc = ccol-1
            nr = crow
            break;
        }
        case EDirection.up:{
            nc = ccol
            nr = crow-1
            break;
        }
    }
    return [nc,nr]
}
interface IWalls{top:number, right:number,bottom:number,left:number}
interface IWhat{
    walls:IWalls,
    vec:EDirection,
    cur:IDir
}
function direction(walls:IWalls, vec:EDirection, cur:IDir):IWhat{
    var crow = cur.row
    var ccol = cur.col

    var next_r=0;
    var next_c=0;
    if(vec == EDirection.right){
        if(ccol == walls.right){
            vec = EDirection.down
            walls.top = walls.top+1
        } else {
            vec = EDirection.right
        }
    } else if(vec == EDirection.down){
        if(crow == walls.bottom){
            vec = EDirection.left
            walls.right = walls.right-1
        } else {
            vec = EDirection.down
        }
    }else if(vec == EDirection.left){
        if(ccol == walls.left){
            vec = EDirection.up
            walls.bottom = walls.bottom-1
        } else {
            vec = EDirection.left
        }
    }else if(vec == EDirection.up){
        if(crow == walls.top){
            vec = EDirection.right
            walls.left = walls.left+1
        } else {
            vec = EDirection.up
        }
    }
    [next_c,next_r] = go_dir(vec,ccol,crow)
    cur = {col:next_c,row:next_r};
    return {walls:walls, vec:vec, cur:cur}
}


// To learn more about the language, click above in "Examples" or "What's New".
// Otherwise, get started by removing these comments and the world is your playground.
  



export async function main(ns: NS) {
var arr:number[][] =         [
        [14,25, 5,44,34],
        [ 6,39,29,49,40]
    ]
console.log(arr)
var answer = [];
var cur_i ={row:0,col:0}
var walls_i = {top:0, right:arr[0].length-1,bottom:arr.length-1,left:0};
var vec_i = EDirection.right;
var ret:IWhat = {walls:walls_i, vec:vec_i, cur:cur_i}
while(answer.length < arr[0].length * arr.length){
    //console.log(ret)
    answer[answer.length]=arr[ret.cur.row][ret.cur.col]
    ret = direction(ret.walls, ret.vec, ret.cur)
}
console.log(answer)
}