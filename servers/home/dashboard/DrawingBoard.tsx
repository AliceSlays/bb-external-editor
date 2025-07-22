
import { ServerListItem, ServerList } from './dashboard-common.tsx';
import { fetchServerList } from './server-info.tsx';
import {rLinkCL} from '../ReactElements.js';
const testData: ServerList = [
  { key: 1, hostname: "test1" },
  { key: 2, hostname: "test2" },
  { key: 3, hostname: "test3" },
];
const ulli = {
  'list-style-type': 'none',
  'padding-left': '0em',
  'background-color': 'white',
  'color': 'black',
  'border': '1px solid black',
};

function DashRowComponent({ item }: { item: ServerListItem }) {
  return (
    <tr key={item.key}>
    <td style={ulli}>{rLinkCL(item.hostname,'connect '+item.hostname)} </td>
    <td style={ulli}> {item.stats?.moneyMax?.toLocaleString('en-US',{maximumFractionDigits: 1,notation:'compact', compactDisplay:'short',useGrouping:true})}</td>
    </tr>
  );
};

function DashTableComponent({ dataList }: { dataList: ServerList }) {
  const rows = dataList.map(item => (
    <DashRowComponent item={item} />
  )
  );

  return (
    <tbody style={ulli}>
      {rows}
    </tbody>
  );
}


function DashboardComponent({ dataList }: { dataList: ServerList }) {
  const dashtable = <DashTableComponent dataList={dataList} />
  return (
    <div>
      Dashboard rendered
      {dashtable}
    </div>
  );
}

function App({ ns }: { ns: NS}) {
  const [data, setData] = React.useState(fetchServerList(ns));
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <DashboardComponent dataList={data} />
      <button onClick={(()=>{setData(fetchServerList(ns));setCount(count=>count+1)})}>Update {count}</button>
    </div>
  );
}

export async function main(ns: NS) {
  ns.ui.openTail();
  ns.disableLog("ALL");
  ns.clearLog();
  const app = <App ns={ns}/>;
  ns.printRaw(app);
  while (true) {
  //  await eventQueue.executeEvents();
    await ns.asleep(1000);
  }

}