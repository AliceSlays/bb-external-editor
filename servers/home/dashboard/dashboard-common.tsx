
export interface ServerListItem {
  key: any,
  hostname: string,
  parent?:string,
  depth?:number,
  stats?: Server
};

export type ServerList = ServerListItem[];

export interface ServerOption {
  hostname: string,
  rammodifier?: number
}
export type ServerOptionList = ServerOption[];
