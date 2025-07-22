

function ProgressBar({ duration }: { duration: number }) {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev > 0) {
          return prev - (100 / (duration / 1000)); // Calculate progress increment
        } else {
          clearInterval(interval); // Stop when complete
          return 0;
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [duration]);//#e0e0e0 3b5998
  return (
    <div style={{ width: '100%', backgroundColor: 'none', borderRadius: '5px' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '20px',
          backgroundColor: 'none',
          borderRadius: '5px',
          textAlign: 'right',
          transition: 'width 10s linear'
        }}>W
      </div>
    </div >
  );
};


function ProgressLetter({ action }: { action: Action }) {
  const [progress, setProgress] = React.useState(100);


  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev > 0) {
          return prev - (100 / (action.duration / 1000)); // Calculate progress increment
        } else {
          clearInterval(interval); // Stop when complete
          return 0;
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount 3b5998
  }, [action.duration]);

  return (
    <div
      style={{
        position: 'absolute',
        width: `${progress}%`,
        height: '20px',
        backgroundColor: 'none',
        borderRadius: '5px',
        textAlign: 'right',
        transition: 'width 1s linear'
      }}>{action.action}
    </div>
  )
}


interface Action {
  action: string,
  duration: number,
  startedAt: number
}
type ActionList = Action[];

function App({ ns }: { ns: NS }) {
  const [actions, setActions] = React.useState<ActionList>([{ action: 'S', duration: 1 * 60 * 1000, startedAt: Date.now() }]);
  
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setActions((actions) => [...actions, { action: 'W', duration: 1 * 60 * 100, startedAt: Date.now() }]);
      setActions((actions) => actions.filter((act) => act.duration > (Date.now() - act.startedAt)));
    }, 1000)
    return () => clearInterval(intervalId);
  }, [actions])

  //    actions.push({ action: 'S', duration: 1 * 60 * 1000, startedAt: Date.now() });
  // <ProgressBar key='a' duration={1 * 60 * 1000} />
  return (
    <div>
      <div style={{ width: '100%', backgroundColor: 'dark', borderRadius: '5px', position: 'relative', height: '20px' }}>
        {
          actions.map(action => {
            const key = action.startedAt.toString().concat(action.action);
            return <ProgressLetter key={key} action={action} />
          })
        }
      </div>
    </div>
  )
}
//    <ProgressBar duration={60 * 1 * 1000} />

export async function main(ns: NS) {
  ns.disableLog("ALL");
  const app = <App ns={ns} />;
  ns.ui.openTail();
  ns.printRaw(app);
  while (true) {
    await ns.asleep(1000);
  }
}