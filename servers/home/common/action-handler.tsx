

interface IWrappedAction {
  action: (...args:any) => any,
  log_transform: (input: any[], output: any) => string
}


interface IWrappedData {
  data: any[],
  logs: string[]
}



// is a monad
// higher order function
// configure separate actions, like logging

function wrapData(data: any, logs: string[] = [`wrapped ${data}`]) {
  console.log('wrap',data, logs)
  return { data: [data], logs: logs }
}

function wrapData_result(result: any, logs: string[]) {
  return { data: result, logs: logs }
}

function unwrapData_data(data: IWrappedData) {
  return data.data
}
function unwrapData_logs(data: IWrappedData) {
  return data.logs ? data.logs : []
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



function doAction(data: any[] | IWrappedData|undefined, action: ((...args:any) => any) | IWrappedAction): IWrappedData | undefined {
  if(data === undefined){
    return undefined
  }
  let provide;
  if (!('data' in data && 'logs' in data)) {
    provide = wrapData(data)
  } else {
    provide = data
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


  let result = perform.action(...provide.data)
  console.log('res',result)
  return wrapData([result], [...provide.logs, perform.log_transform(provide.data, result)])
}

export async function main(ns: NS) {
  var data = [1, 2, 3]
  var data2 = [[5, 2, 3].reduce((sum, v) => { return sum + v }, 0)]
  console.log('d', data2)
  var action = (arr: number[]) => {
    console.log(arr)
    return arr.reduce((sum, v) => { return sum + v*v }, 0)
  }
  var ret = doAction(data, action)
  console.log('r1',ret)
  var ret2 = doAction(data2, action)
  console.log('r2',ret2)
  var ret3 = doAction(ret2, action)
  console.log('r3',ret3)

}