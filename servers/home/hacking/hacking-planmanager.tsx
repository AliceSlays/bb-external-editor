import { PlanTracker } from '../hacking/hacking-track-deploy.tsx';
import { HackActionType, HackActionDifficulty, HackActionFiles } from '../hacking/hacking-common.tsx'


export class HackPlanManager {
  target: string;
  timeline: PlanTracker[] = [];
  plan_window: number;
  plan_window_offset: number;
  plan_pattern;



  constructor(target: string, plan_window: number, plan_pattern = [HackActionType['W'], HackActionType['G'], HackActionType['W'], HackActionType['H']]) {
    this.target = target;
    this.plan_window = plan_window;
    this.plan_window_offset = Date.now() % plan_window;
    this.plan_pattern = plan_pattern;
    this.timeline.push(new PlanTracker(
  //    Math.ceil(Date.now() / this.plan_window) * this.plan_window,
  //    Math.ceil(Date.now() / this.plan_window) * this.plan_window + this.plan_window,
      Date.now(),
      Date.now() + this.plan_window,
      this.plan_pattern
    ))
  }

  // remove passed plans
  uptick() {
    //  console.log('uptick', this.timeline.length)
    this.timeline = this.timeline.filter(plan => {
      return plan.plan_end > Date.now()
    })
    //    console.log('uptick?huh',this.timeline.length)
  }

  plan_until() {
    if (this.timeline.length == 0) {
      return Date.now() - 1
    }
    return this.timeline[this.timeline.length - 1].plan_end;
  }

  pad_the_timeline(test_time: number) {
    /*
    if (this.timeline.length > 0) {
      console.log(test_time, this.plan_until(), ' ', this.timeline[this.timeline.length - 1].plan_start, this.timeline[this.timeline.length - 1].plan_end)
    } else {
      console.log(test_time, 'why?huh',this.timeline.length)
    }
    */
    while (test_time > this.plan_until()) {
      this.timeline.push(new PlanTracker(this.plan_until(), this.plan_until() + this.plan_window, this.plan_pattern))
    }
    //console.log('pad', test_time, this.plan_until())
  }

  getPlanPos(duration: number): number | undefined {
    this.pad_the_timeline(Date.now() + duration)
    var count = 0;
    //console.log(this.timeline)
    while (count < this.timeline.length) {
      if (this.timeline[count].is_in_plan(Date.now() + duration)) {
        return count
      }
      count++;
    }
    return undefined
  }

  can_deploy(actionType: HackActionType, duration: number, pos:number) {
    this.pad_the_timeline(Date.now() + duration)
    var count = 0;
    while (count < this.timeline.length) {
      if (this.timeline[count].can_deploy(actionType, duration, pos)) {
        return true;
      }
      count++;
    }
    return false;
  }

  deploy_action(actionType: HackActionType, duration: number, pos: number, threads: number) {
    var plan_pos = this.getPlanPos(duration);
    if (plan_pos === undefined) {
      return false;
    }
    return this.timeline[plan_pos].deploy_action(actionType, duration, pos, threads);
  }
}




export async function main(ns: NS) {
  var planManager = new HackPlanManager('silver-helix', 10000)
  console.log(planManager.getPlanPos(3000))
  console.log(planManager.can_deploy(HackActionType['G'],3000))
  console.log(planManager.deploy_action(HackActionType['W'],2000,0,10))
  console.log(planManager.can_deploy(HackActionType['H'],3000))



}