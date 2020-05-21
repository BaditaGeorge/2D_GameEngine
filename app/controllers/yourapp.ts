import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';
import GroupService from 'game-engine/services/group-service';
import InputKeyProcessor from 'game-engine/services/input-key-processor';
import ShapeService from 'game-engine/services/shape-service';

export default class Yourapp extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  // config_arr:string = JSON.stringify([{"type":"circle","cx":"200","cy":"100","r":"50","fill":"green"},
  // {"type":"circle","r":"100","cx":"300","cy":"300"},
  // {"type":"rect","w":"50","h":"50","x":"10","y":"10"},
  // {"type":"polygon","points":[150,0,75,200,225,200],"fill":"blue"}]);
  // @tracked config_arr:Array<any> = [{type:'rect',w:50,x:10,h:50,y:10,fill:'blue'}];
  elementsToRender: Array<string> = ['render/group'];
  groupModel = GroupService.create();
  keyProcessor = InputKeyProcessor.create();
  bullet = ShapeService.create();

  constructor() {
    super(...arguments);
    // this.groupModel.addElement({type:'rect',w:50,x:10,h:50,y:10,fill:'blue'});
    // this.groupModel.addElement({type:'rect',w:50,x:65,h:50,y:10,fill:'blue'});
    let basicObj = { type: 'rect', w: 50, x: 10, h: 50, y: 10 };
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.groupModel.addElement(Object.assign({}, basicObj));
        basicObj['x'] += 55;
      }
      basicObj['x'] = 10;
      basicObj['y'] += 55;
    }
    this.simpleEl = ShapeService.create();
    this.simpleEl.setConfig({ type: 'rect', w: 50, x: 10, h: 50, y: 500, fill: 'blue' });
    console.log(this.simpleEl.config_obj);
    this.doSomething();
  }

  moveGrid(){
    this.groupModel.setAttribute('x',undefined,5);
  }

  doSomething(): void {
    let contor = 0;
    // window.setInterval(()=>{
    //   this.moveGrid();
    // },500);
    window.setInterval(()=>{
      if (this.keyProcessor.isKeyDown('ArrowRight')) {
        if(this.simpleEl.getAttribute('x') < 1200){
          this.simpleEl.setAttribute('x', undefined, 5);
        }
      }
      if (this.keyProcessor.isKeyDown('ArrowLeft')) {
        if(this.simpleEl.getAttribute('x') > 0){
          this.simpleEl.setAttribute('x', undefined, -5);
        }
      }
      if(this.keyProcessor.isKeyDown('Space')){
        console.log('a');
        this.bullet.setConfig({ type: 'rect', w: 50, x: 200, h: 50, y: 500, fill: 'blue' });
      }
      // this.groupModel.setAttribute('x',undefined,5);
    },16);
  }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'yourapp': Yourapp;
  }
}
