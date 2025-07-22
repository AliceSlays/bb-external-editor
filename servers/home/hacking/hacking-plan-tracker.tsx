import { HackActionCondition, HackPlanSingle, HackAction, HackActionTypeMeta, HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'



// make state machine
// statemachine tracks last active action in plan
// statemachine tracks finishing time of said action
// statemachine tracks when plan fully deployed or finished or failed

// a class that wraps statemachine to acually do all that

// a way to keep track of all plans (state machines)

interface HackActionDeployed {
  actionType: HackActionType,
  start: number,
  end: number,
  threads?: number
}

interface HackActionPlaceholder {
  actionType: HackActionType,
  deployed: boolean,
  window_start: number,
  window_end: number,
  pos: number,
}
// import {PlanTracker} from '../hacking/hacking-track-deploy.tsx';
export class PlanTracker {
  pattern;
  // deployed: Array<HackActionDeployed> = [];
  tracking: Array<HackActionPlaceholder> = [];
  active: boolean = false;
  finished: boolean = false;
  plan_start: number;
  plan_end: number;

  constructor(plan_start: number, plan_end: number, pattern: HackActionType[]) {
    this.plan_start = plan_start;
    this.plan_end = plan_end;
    this.pattern = pattern;
    var action_window = (plan_end - plan_start) / (pattern.length)
    for (let i = 0; i < this.pattern.length; i++) {
      this.tracking[i] = { actionType: pattern[i], deployed: false, window_start: plan_start + (action_window * i), window_end: plan_start + (action_window * (i + 1) - 0.0001), pos: i }
    }
    //console.log(this.tracking)
    return this;
  }

  deploy_action(actionType: HackActionType, duration: number, pos: number, threads?: number) {
    if (!this.can_deploy(actionType, duration, pos)) {
      return false;
    }
    var verify_pos = this.getTrackingPos(duration + Date.now())
    if (verify_pos != pos) {
      return false
    }
    //var act = { actionType: actionType, start: Date.now(), end: Date.now() + duration, threads: threads ? threads : 0 }
    //this.deployed.push(act);
    //console.log(this.tracking[pos], 'here', actionType, 'dur', duration + Date.now())
    this.tracking[pos].deployed = true;
    this.active = true;
    return true;
  }


  is_in_plan(time: number): Boolean {
    return (this.plan_start <= time && time < this.plan_end)
  }

  getTrackingPos(expected_end: number): number | undefined {
    //console.log(expected_end)
    var obj = this.tracking.find(hap => hap.window_start <= expected_end && expected_end < hap.window_end)
    if (obj === undefined) {
      return undefined
    }
    //console.log('obj pos',obj.pos)
    return obj.pos
  }

  is_vacant(pos: number): boolean {
    return !this.tracking[pos].deployed
  }

  is_right_type(pos: number, actionType: HackActionType): boolean {
    return this.tracking[pos].actionType == actionType
  }
  is_active() {
    return this.active
  }
  is_in_window(duration: number, pos:number){
    return this.tracking[pos].window_start <= Date.now()+duration && Date.now()+duration < this.tracking[pos].window_end
  }
  can_deploy(actionType: HackActionType, duration: number, pos:number): boolean {
    var expected_end = duration + Date.now()
    var pos_in_plan = this.getTrackingPos(expected_end);
    if (pos_in_plan === undefined) {
      return false;
    }
    if (pos_in_plan != pos) {
      return false;
    }
    if (!this.is_vacant(pos_in_plan)) {
      return false;
    }
    if (!this.is_right_type(pos_in_plan, actionType)) {
      return false;
    }
    if(!this.is_in_window(duration,pos_in_plan)){
      return false;
    }
    if(!this.is_active() && (HackActionType['H'] || HackActionType['G']) ){
      return false
    }
    //console.log('can_deploy_pos',pos)
    return true;
  }


}


export async function main(ns: NS) {
  var planTracker = new PlanTracker(Date.now(), Date.now() + 10000, [HackActionType['W'], HackActionType['G'], HackActionType['W'], HackActionType['H']])
  var test = 1000
  console.log('is in plan', planTracker.is_in_plan(Date.now() + test))
  var pos = planTracker.getTrackingPos(Date.now() + test)
  if (pos === undefined) {
    console.log('pos undef')
    return
  }
  console.log('pos', pos)
  console.log('is_vacant', planTracker.is_vacant(pos))
  console.log('is_right_type', planTracker.is_right_type(pos, HackActionType['W']))
  console.log('can_deploy', planTracker.can_deploy(HackActionType['W'], test,pos))

}