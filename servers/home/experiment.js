
/** @param {NS} ns */
export async function main(ns) {

  //ns.printRaw(getElementById("overview-extra-hook-0").appendChild(React.createElement("h1", {id:'experiment'}, state.age)));
  //await ns.printRaw(demo);
  await ns.ui.openTail();
  const demo = React.createElement("h1",{id:'experiment-hook'},undefined)
  ReactDOM.render(
    <React.StrictMode>
    <h1>test</h1>
    </React.StrictMode>)
    ns.printRaw(demo)
}