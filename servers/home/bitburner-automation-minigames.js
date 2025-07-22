import { addCSS, getUniqueID, rBreak, rButton, rCheckbox, rCheckboxValue, rCyan, rDropdown,
		rDropdownValue, rLinkCL, rLinkFunc, rLinkSC, rText, rTextGet, rTextSet, rYellow } from "ReactElements.js";

/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();

  var doc = window.document;
  ns.printRaw(doc.querySelectorAll(".MuiBox-root").forEach((x,y)=> ns.printRaw([x.getElementsByTagName("h4").length,y.toString()])));
  ns.printRaw(doc.getElementsByTagName("h4").length);
  ns.printRaw(`I have ${ns.getPlayer().money}\$`);

  //ns.ui.closeTail();
}