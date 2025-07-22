/** @param {NS} ns */
export async function main(ns) {
  
  var port1111 = ns.getPortHandle(1111);
  port1111.tryWrite("close");
}