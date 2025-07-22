// import {HackActionCondition, HackPlanSingle, HackAction, HackActionTypeMeta, HackActionType, HackActionDifficulty, HackActionFiles} from '../hacking/hacking-common.tsx'


export interface HackActionCondition {
  action: HackAction,
  deployed: boolean,
  start_time?: number,
  end_time?: number
}

export interface HackPlanSingle {
  hostname: string,
  percentile: number,
  weaken1: HackAction,
  grow1: HackAction,
  weaken2: HackAction,
  hack1: HackAction
}
export interface HackAction {
  goal: HackActionType,
  threads: number,
  ttwgh: number,
  secdif: number,
  delay: number
}

export interface HackActionTypeMeta {
  goal: string,
  filename: string,
  secdif: number
}
export enum HackActionType {
  'W' = 'W',
  'G' = 'G',
  'H' = 'H'
}


export enum HackActionDifficulty {
  'W' = -0.05,
  'G' = 0.004,
  'H' = 0.002
}

export enum HackActionFiles {
  'W' = 'hacking/hacking-server-weaken.tsx',
  'G' = 'hacking/hacking-server-grow.tsx',
  'H' = 'hacking/hacking-server-hack.tsx',
}
