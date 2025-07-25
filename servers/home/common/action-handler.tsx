

interface IWrappedAction {
  action: (...args:any) => any,
  log_transform: (input: any[], output: any) => string
}


interface IWrappedData {
  input_args: any[],
  logs: string[]
}



// is a monad
// higher order function
// configure separate actions, like logging

function wrapData(input_args: any[], logs: string[] = [`wrapped ${input_args}`]) {
  return { input_args: input_args, logs: logs }
}

function rewrap(result: IWrappedData) {
  return { input_args: result.input_args[0], logs: [...result.logs,`rewrapped ${result.input_args}`] }
}

function unwrapData_data(input_args: IWrappedData) {
  return input_args.input_args
}
function unwrapData_logs(input_args: IWrappedData) {
  return input_args.logs ? input_args.logs : []
}
function wrapAction(action: (...args:any) => any, log_transform: (input: any[], output: any[]) => string): IWrappedAction {
  return { action: action, log_transform: log_transform }
}

function unwrapAction_action(action: IWrappedAction) {
  return action.action
}
function unwrapAction_transform(action: IWrappedAction) {
  return action.log_transform
}



function doActionWithLogs(input_args: any[] | IWrappedData|undefined, action: ((...args:any) => any) | IWrappedAction): IWrappedData | undefined {
  if(input_args === undefined){
    return undefined
  }
  let provide;
  if (!('input_args' in input_args && 'logs' in input_args)) {
    provide = wrapData(input_args)
  } else {
    provide = input_args
  }

  let perform: IWrappedAction;
  if (typeof action == 'function') {
    perform = wrapAction(action, (input: any[], output: any[]) => { return `Input ${input} output ${output}` })
  } else if (('action' in action && 'log_transform' in action)) {
    perform = action
  } else {
    console.log('Error: Wrong argument "action"')
    return undefined
  }

  console.log('input_args',provide.input_args)

  let result = perform.action(...provide.input_args)
  console.log('res',result)
  return wrapData([result], [...provide.logs, perform.log_transform(provide.input_args, result)])
}

interface ICommand{
    data:any[],
    command:(...args:any[])=>any,
    action:any
}


function test_Command(ns:NS):IWrappedData |undefined{
    const func1 = (a:number,b:number) => { console.log('ab',a,b)
    return a+b}
    const data1 = [5,7]
    //let command1_data = [data1,func1]
    //let command1_p1 = {data:data1, command:func1, action:doActionWithLogs}
    //let ret = command1_p1.action(command1_p1.data,command1_p1.command)
    //console.log(ret)

    let ver = doActionWithLogs(data1,func1)
    console.log('ver1',ver)
    const func2 = (a:number)=>{return [a,a*a]}
    ver = doActionWithLogs(ver,func2)
    ver = rewrap(ver)
    console.log('ver2',ver)
    ver = doActionWithLogs(ver,func1)
    console.log('ver3',ver)


return ver

}


function test_CQ(ns:NS){

  let queue:{input_args:any[],action:(...args:any[])=>any}[] = []
    const func1 = (a:number,b:number) => { console.log('ab',a,b)}
    const data1 = [5,7]

  let c1 = {input_args:data1 ,action:func1}
  queue.push(c1)

}



export async function main(ns: NS) {
  /*
  var data = [1, 2, 3]
  var data2 = [[5, 2, 3].reduce((sum, v) => { return sum + v }, 0)]
  console.log('d', data2)
  var action = (arr: number[]) => {
    console.log(arr)
    return arr.reduce((sum, v) => { return sum + v*v }, 0)
  }
  var ret = doActionWithLogs(data, action)
  console.log('r1',ret)
  var ret2 = doActionWithLogs(data2, action)
  console.log('r2',ret2)
  var ret3 = doActionWithLogs(ret2, action)
  console.log('r3',ret3)
*/
  let ver = test_Command(ns)

  console.log('res',ver)


}