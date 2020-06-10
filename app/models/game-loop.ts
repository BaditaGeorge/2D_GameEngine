
export default class GameLoop{

    loops:{[key:string]:any}= {};
    events:{[key:string]:any} = {};

    constructor(){

    }

    addLoop(loopKey:string,evnt:(...args:any[])=>void,loopFrequency:number){
        this.loops[loopKey] = window.setInterval(evnt,loopFrequency);
        this.events[loopKey] = evnt;
    }

    clearLoop(loopKey:string){
        clearInterval(this.loops[loopKey]);
    }

    changeLoopFrequency(loopKey:string,loopFrequency:number){
        clearInterval(this.loops[loopKey]);
        this.loops[loopKey] = window.setInterval(this.events[loopKey],loopFrequency);
    }
}