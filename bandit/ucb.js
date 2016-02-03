import random from "lodash.random"

const zeroPad = (len) => {
  return Array.apply(null, new Array(len)).map(Number.prototype.valueOf,0);
}
export default class MultiBandit{
  constructor({arms}){
    this.arms = arms
    this.rewards = Array(arms).fill(0).map( () => [] )

  }
  reward(arm, reward){
    this.rewards[arm].push(reward)    
  }
  get values(){ // expectation
    return this.rewards.map( (r) => {
      let sum = r.reduce( (sum, val) => sum + val, 0)
      return sum / r.length
    })
  }
  get counts(){
    return this.rewards.map( (r) => {
      return r.length
    })
  }
  get n(){
    return this.counts.reduce( (sum, ct) => {
      return sum + ct
    }, 0)
  }
  calcUCB(arm){
    let r = this.rewards[arm]
    if(r.length == 0){
      return 
    }
  }
  select(num){
    let top = 2 * Math.log(this.n)
    let check = this.counts.indexOf(0);
    if (check !== -1) {
      return check
    }

    let valuesUCB = this.counts.map( (ct, i ) => {
      return this.values[i] + Math.sqrt(top / ct)
    })
    let arm = valuesUCB.indexOf(Math.max.apply(null, valuesUCB))
    return arm
  }
}