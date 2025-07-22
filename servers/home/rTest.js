/* rTest.js  (4.4GB)  v0.5.2 */
import { addCSS, getUniqueID, rBreak, rButton, rCheckbox, rCheckboxValue, rCyan, rDropdown,
		rDropdownValue, rLinkCL, rLinkFunc, rLinkSC, rText, rTextGet, rTextSet, rYellow } from "ReactElements.js";

/** @param {NS} ns */
export async function main(ns) {
	/** @type {Document} - NetScript `document` replacement object. */
	const doc = eval("document");

	/**
	 * thinkCommands: Has brain.js run the given string as a command.
	 *
	 * @param	{string}	commands	A string with the terminal command(s) to run.
	 * @returns	{Promise}				Returns a Promise object.
	 **/
	async function thinkCommands (commands) {  // deepscan-ignore-line
		return await think(ns.pid, "(function () { " + commands + " })()");
	}

	/**
	 * forceTailRefresh: The tail windows normally only refresh every 200ms, so use this function to trigger an immediate refresh.
	 **/
	function forceTailRefresh () {
		let tailProps = ns.getRunningScript(ns.pid).tailProperties;  // Attempt to get the tail window's properties.
		if (tailProps !== null) {  // If the tail window exists...
			ns.ui.resizeTail(tailProps.width, tailProps.height);  // ...force a refresh by "resizing" the tail window to the same size.
		}
	}

	/**
	 * getTailTextElement: Get the HTML element to be passed to `autoResizeTail()` or `getResizedTailSizes()`.
	 *
	 * @returns	{HTMLElement}	Element to target with `autoResizeTail()`.
	 **/
	function getTailTextElement () {
		/** @type {HTMLElement} */
		let tailElement = doc.querySelectorAll('[title="' + ns.getRunningScript().title + '"]');
		if (tailElement.length > 0) {
			return tailElement[tailElement.length - 1].parentNode.nextSibling.firstChild;  // Uses the newest matching tail window.
		}
		return undefined;
	}
	/**
	 * getResizedTailSizes: Returns the width and height of the tail window as though it was resized to fit the unwrapped tail window's contents.
	 *
	 * @param	{HTMLElement} tailTextElement	The element returned from `getTailTextElement()`.
	 * @returns	{TailProperties}
	 **/
	function getResizedTailSizes (tailTextElement) {
		let ret = null;
		if (tailTextElement !== undefined) {
			/** @type {TailProperties} */
			let tailProps = ns.getRunningScript(ns.pid).tailProperties;  // Attempt to get the tail window's properties.
			if (tailProps !== null) {  // If the tail window exists...
				for (let child of tailTextElement.childNodes) child.style.textWrap = "nowrap";  // Get the height of the text for each line, without the text being wrapped to multiple lines.
				tailTextElement.style.width = "fit-content";  // Get the actual width of the log window's text.
				if (tailTextElement.offsetWidth > 0 && tailTextElement.offsetHeight > 0) {  // If it's a valid width and height...
					tailProps.width = Math.ceil(tailTextElement.offsetWidth);
					tailProps.height = Math.ceil(tailTextElement.offsetHeight) + 34;
					ret = tailProps;
				}
				for (let child of tailTextElement.childNodes) child.style.textWrap = "";  // Put the wrapping back to the default.
				tailTextElement.style.width = "";  // Put the width back to the default.
			}
		}
		return ret;
	}
	/**
	 * autoResizeTail: Automatically resizes the tail window, if needed.  Returns whether the tail window was resized.
	 *
	 * @param	{HTMLElement} tailTextElement	The element returned from `getTailTextElement()`.
	 * @returns	{boolean}
	 **/
	function autoResizeTail (tailTextElement) {
		let ret = false;
		if (tailTextElement !== undefined) {
			/** @type {TailProperties} */
			let tailProps = getResizedTailSizes(tailTextElement);
			if (tailProps !== null) {  // If the tail window exists...
				if (tailProps.width > 0 && tailProps.height > 0) {  // ...and it's a valid width and height...
					ns.ui.resizeTail(tailProps.width + 4, tailProps.height);  // ...then fit the window to the text.
					ret = true;
				}
			}
		}
		return ret;
	}
	/**
	 * autoExpandTail: Automatically expands the tail window, if needed.  Returns whether the tail window was resized.
	 *
	 * @param	{HTMLElement}		tailTextElement	The element returned from `getTailTextElement()`.
	 * @param	{TailProperties}	tailSizes
	 * @returns	{boolean}
	 **/
	function autoExpandTail (tailTextElement, tailSizes) {
		let ret = false;
		if (tailTextElement !== undefined) {
			/** @type {TailProperties} */
			let tailProps = getResizedTailSizes(tailTextElement);
			if (tailProps !== null) {  // If the tail window exists...
				if (tailProps.width > 0 && tailProps.height > 0) {  // ...and it's a valid width and height...
					tailSizes.width = Math.max(tailSizes.width, tailProps.width);
					tailSizes.height = Math.max(tailSizes.height, tailProps.height);
					ns.ui.resizeTail(tailSizes.width + 4, tailSizes.height);  // ...then fit the window to the text.
					ret = true;
				}
			}
		}
		return ret;
	}

	/**
	 * @typedef		{Object}						TargetObj
	 * @property	{(string | number | boolean)}	value
	 *
	 * @typedef		{Object}						ChangeValue
	 * @property	{TargetObj}						target
	 **/
	/**
	 * dd1Func: This is a sample dropdown event handler capable of directly updating elements.  (Works even when the app is stopped.)
	 *
	 * @param {(React.ChangeEvent | ChangeValue)}	event
	 **/
	function dd1Func (event) {
		let ddTxt = event.target.selectedOptions[0].text;
		// dd1val = rDropdownValue(dd1);
		if (rTextGet(dd1id) != ddTxt) {  // If the text that should be displayed is out of date...
			rTextSet(dd1id, ddTxt);  // ...update the display of the current dropdown text...
			autoExpandTail(tailElement, tailSize);  // ...and trigger a refresh of the tail window.
		}
	}
	/**
	 * dd2Func: This is a sample dropdown event handler.
	 *
	 * @param {(React.ChangeEvent | ChangeValue)}	event
	 **/
	function dd2Func (event) {
		dd2val = event.target.value;  // The 2nd dropdown changed, so update the value of dd2val.
	}

	/**
	 * cbFunc: This is a sample checkbox event handler.
	 *
	 * @param {(React.ChangeEvent | ChangeValue)}	event
	 **/
	function cbFunc (event) {
		let textEl, elID = event.id;
		if (event.label == "Label1") {
			textEl = doc.getElementById(cb1id);
		}
		if (event.label == "Label2") {
			textEl = doc.getElementById(cb2id);
		}
		if (textEl) {
			textEl.textContent = "" + rCheckboxValue(elID);
		}
	}

	/**
	 * exitEvent: Called by ns.atExit() to run just before the script ends or when it's killed.
	 **/
	function exitEvent () {
		if (ns.getRunningScript().tailProperties !== null) {  // If the "tail" window is open...
			ns.ui.closeTail();  // ...then close it before the application exits.
		}
	}


	/* Main Code */
	ns.disableLog("ALL");
	ns.clearLog();
	// ns.atExit(exitEvent);  // Uncomment this if you want it so that stopping the script also closes the tail/log window.
	addCSS();  // This needs to be run first to set up how the React elements will be styled.
	ns.ui.openTail();
	let tailElement = getTailTextElement();  // Get the tail element for use with the `getResizedTailSizes()`, `autoResizeTail()`, and `autoExpandTail()` functions.
	// Set the title of the tail window.
	ns.ui.setTailTitle(rText("React Elements Test",
		{
			paddingLeft: 8,
			margin: 0,
			fontFamily: '"Lucida Console", "Lucida Sans Unicode", "Fira Mono", Consolas, "Courier New", Courier, monospace, "Times New Roman"',
			fontWeight: 500,
			fontSize: '1.25rem',
			lineHeight: '1.5em',
			color: 'rgb(0, 204, 0)',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden'
		}
	));
	// Display a button and some values.
	let dd1id = getUniqueID("dd1val"), dd2id = getUniqueID("dd2val", [dd1id]);
	ns.printRaw([rYellow("rButton test: "), rButton("Show alert", function () { ns.alert("Test"); }),
		rYellow(" | DDValues: "), rText("-", undefined, dd1id), rText(" / -", undefined, dd2id)]);
	// Display two dropdowns which change the values displayed above.
	let ddOptions = [{ text: "First", value: 1 }, { text: "Test", value: 2 }, { text: "Wider text", value: 3 }, { text: "Last", value: 4 }];
	let ddOptionText = {};
	for (let el of ddOptions) {  // Create an object to make it easy to look up the text strings by the value.  (Requires that the values be unique.)
		ddOptionText[el.value] = el.text;
	}
	let dd1 = getUniqueID("dd1"), dd2 = getUniqueID("dd2", [dd1]), dd1val, dd2val = 1;
	ns.printRaw([rDropdown(ddOptions, dd1Func, rYellow("rDropdown test: "), 0, undefined, dd1),
		rDropdown(ddOptions, dd2Func, " ", 0, undefined, dd2)]);
	// Display a variety of link types.
	ns.printRaw([rYellow("rLinkCL test: "), rCyan("(command line links)"), rBreak(),
		"  ", rLinkCL("Run 'sudov'", "sudov"), rYellow("         |  "), rLinkCL("Run 'analyze'", "analyze")]);
	ns.printRaw([rYellow("rLinkFunc test: "), rCyan("(function launching links)"), rBreak(),
		"  ", rLinkFunc("Open alert (0 RAM)", function () { ns.alert("Test"); }), rYellow("  |  "),
		rLinkFunc("Open alert (0.3 RAM)", function () { ns.alert(ns.getRunningScript(ns.pid).title); })]);
	ns.printRaw([rYellow("rLinkSC test: "), rCyan("(script command links)"), rBreak(),
		"  ", rLinkSC("Open alert (0 RAM)", 'ns.alert("Test");', ns), rYellow("  |  "),
		rLinkSC("Open alert (0.3 RAM)", 'ns.alert(ns.getRunningScript(ns.pid).title);', ns)]);
/* Tests "brain.js", a custom service for running scripts:
	ns.printRaw([rYellow("brain.js test:"), rBreak(),
		"  ", rLinkFunc("Open alert (0 RAM)", function () { thinkCommands('ns.alert("Test");'); }), rYellow("  | "),
		rLinkFunc("Open alert (0.3 RAM)", function () { thinkCommands('ns.alert(ns.getRunningScript(ns.pid).title);'); })]);
*/
	// Display checkboxes.
	let cb1 = getUniqueID("cb1"), cb2 = getUniqueID("cb2"), cb1id = getUniqueID("cb1val"), cb2id = getUniqueID("cb2val");
	ns.printRaw([rYellow("rCheckbox test:"), rBreak(),
		rCheckbox("Label1", cbFunc, true, cb1, undefined, "altText1"), " ", rCheckbox("Label2", cbFunc, false, cb2, undefined, "altText2"),
		rYellow("  |  CBValues: "), rText("true", undefined, cb1id), " / ", rText("false", undefined, cb2id)]);
	// Wait for the elements printed earlier to be displayed.
	let startTime = performance.now();
	while (doc.getElementById(dd1id) === null && performance.now() - startTime < 1000) {  // Wait up to 1 second for the HTML element to be displayed.
		await ns.asleep(20);
	}
	if (doc.getElementById(dd1id) === null) {  // The element we created couldn't be found...  (which shouldn't happen)
		ns.printRaw(rRed("Error: Unable to access HTML elements."));  // ...so show an error message...
		return false;  // ...and quit the application.
	}
	dd1val = rDropdownValue(dd1);  // Get the value representing the currently selected option in the first dropdown.
	rTextSet(dd1id, ddOptionText[dd1val]);  // Convert that value to the text and display it.
	// Resize the tail window and keep the application running.
	autoResizeTail(tailElement);  // Trigger a refresh of the tail window.
	let tailSize = getResizedTailSizes(tailElement);  // Get initial tail window size for use in `autoExpandTail()`.
	while (true) {  // Wait for updates.
		if (rTextGet(dd2id) != " / " + ddOptionText[dd2val]) {  // If the dropdown's text isn't current...
			rTextSet(dd2id, " / " + ddOptionText[dd2val]);  // ...then update it.
		}
		if (ns.getRunningScript().tailProperties === null) {  // End the script if the "tail" window was closed.
			ns.exit();
		}
		autoExpandTail(tailElement, tailSize);  // Trigger a refresh of the tail window.
		await ns.asleep(100);
	}
}