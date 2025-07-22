import {DashRow} from 'DashRow.tsx';

export default function DashTable(ns: NS) {
  return (<ul>
  <DashRow key={serverList.name} info={serverList}/>
  </ul>
  );
}