

export async function main(ns:NS) {
  ns.ui.openTail()
  var arr = [];
  arr[10]=10
  arr[12]=12
  ns.printRaw(arr)
}