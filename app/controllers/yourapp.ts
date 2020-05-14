import Controller from '@ember/controller';

export default class Yourapp extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  config_arr:string = JSON.stringify([{"type":"circle","cx":"200","cy":"100","r":"50","fill":"green"},
  {"type":"circle","r":"100","cx":"300","cy":"300"},
  {"type":"rect","w":"50","h":"50","x":"10","y":"10"},
  {"type":"polygon","points":[150,0,75,200,225,200],"fill":"blue"}]);
  elementsToRender:Array<string> = ['render/group'];
  constructor(){
    super(...arguments);
  }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'yourapp': Yourapp;
  }
}
