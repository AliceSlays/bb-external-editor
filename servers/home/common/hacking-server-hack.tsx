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
      var got_money = await ns.hack(ns.args[0], options);;
      //if (got_money > 0) {
        console.log(`${ns.getHostname()} Hacked ${ns.args[0]} for ${ns.formatNumber(got_money)}`);
      //}
    }
  }
}