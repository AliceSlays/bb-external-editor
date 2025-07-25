import {BasicHGWOptions} from 'NetscriptDefinitions'

export async function main(ns: NS) {
  var additionalMsec: number = 0;
  var stocks: boolean = false;
  var threads: number = 1;

  for (let i = 1; i < ns.args.length; i++) {
    if (ns.args[i] == 'stocks') {
      stocks = true;
    }
    if (ns.args[i] == 'msec') {
        additionalMsec = Number(ns.args[i + 1]);
    }
    if (ns.args[i] == 't') {
      threads = Number(ns.args[i + 1]);
    }
  }


  var options: BasicHGWOptions = {
    additionalMsec: additionalMsec,
    stock: stocks,
    threads: threads
  }
  if (ns.args.length > 0) {
    if (typeof ns.args[0] == 'string') {
      var growth = await ns.grow(ns.args[0], options);
    }
  }
}