
const wnd = window;
const doc = document;

interface IProps {
  onKeyDown: (event: KeyboardEvent) => void;
  onFailure: (options?: { automated: boolean }) => void;
}

function KeyHandler(props: IProps): React.ReactElement {
  React.useEffect(() => {
    function press(event: KeyboardEvent): void {
      props.onKeyDown(event);
    }
    document.addEventListener("keydown", press);
    return () => document.removeEventListener("keydown", press);
  });

  // invisible autofocused element that eats all the keypress for the minigames.
  return <></>;
}

function replaceKeyHandler(ns:NS){
  console.log(doc.getElementsByTagName(''))
}

function determineMinigame(dom: HTMLCollectionOf<HTMLHeadingElement>): string {

  for (var i = 0; i < dom.length; i++) {
    const content = dom[i].textContent;
    if (content?.includes('Type it')) { //Backward Game
      return 'Backward Game';
    } else if (content?.includes('Close the brackets')) { //Bracket Game
      return 'Bracket Game';
    } else if (content?.includes('Say something nice about the guard')) { //Bribe Game
      return 'Bribe Game';
    } else if (content?.includes('Enter the Code!')) { //CheatCode Game
      return 'CheatCode Game';
    } else if (content?.includes('Match the symbols!')) { //Cyberpunk2077 Game
      return 'Cyberpunk2077 Game';
    } else if (content?.includes('Remember all the mines!')) { //Minesweeper P1 Game
      return 'Minesweeper P1 Game';
    } else if (content?.includes('Mark all the mines!')) { //Minesweeper P2 Game
      return 'Minesweeper P2 Game';
    } else if (content?.includes('Cut the wires with the following properties!')) { //Wirecutting Game
      return 'Wirecutting Game';
    } else if (content?.includes('Guarding ...')) { //Slash P1 Game
      return 'Slash P1 Game';
    } else if (content?.includes('Distracted!')) { //Slash P2 Game
      return 'Slash P2 Game';
    } else if (content?.includes('Alerted!')) { //Slash P3 Game
      return 'Slash P3 Game';
    }
  }
  return 'undetermined';
}


function FindOptions() {
  const [infiltrating, setInfiltrating] = React.useState(false);
  const [minigame, setMinigame] = React.useState('placebo');
  const [gw, setGW] = React.useState(doc);

  function handleClick() {
    const progressBars = doc.getElementsByClassName("MuiLinearProgress-root");
    const buttons = doc.getElementsByClassName("MuiButtonBase-root");
    var gameWindow;
    setInfiltrating(false);
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent == 'Cancel Infiltration') {
        setInfiltrating(true);
        const mini = determineMinigame(doc.getElementsByTagName("h4"));
        setMinigame(mini);
        break;
      }
    }
    //  if (progressBars.length > 0) {
    //    setInfiltrating(true);
    //   } else {
    //     setInfiltrating(false);
    //   }
  }
  return (
    <>
      <button onClick={handleClick}>Update Minigame State</button>
      <br />
      <b>{infiltrating ? minigame : 'no detected'}</b>
    </>
  )
}

function App({ ns }: { ns: NS }) {
  return (<div>
    <FindOptions />
  </div>)
}


export async function main(ns: NS) {
  ns.disableLog("ALL");
  ns.clearLog();
  ns.ui.openTail();
  const hook = doc.getElementById("overview-extra-hook-0");
  const app = <App ns={ns} />;
  const running = ns.scriptRunning(ns.getScriptName(), "home");
  ReactDOM.render(app, hook);
  if (hook) {
    ReactDOM.unmountComponentAtNode(hook);
  }
  while (running) {
    await ns.asleep(1000);
  }
  if (hook) {
    ReactDOM.unmountComponentAtNode(hook);
  }
}