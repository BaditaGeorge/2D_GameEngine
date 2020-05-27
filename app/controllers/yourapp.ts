import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';

import ShapeModel from 'game-engine/models/shape-model';
import GroupModel from 'game-engine/models/group-model';
import InputKeyModel from 'game-engine/models/input-key-model';

export default class Yourapp extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  // config_arr:string = JSON.stringify([{"type":"circle","cx":"200","cy":"100","r":"50","fill":"green"},
  // {"type":"circle","r":"100","cx":"300","cy":"300"},
  // {"type":"rect","w":"50","h":"50","x":"10","y":"10"},
  // {"type":"polygon","points":[150,0,75,200,225,200],"fill":"blue"}]);
  // @tracked config_arr:Array<any> = [{type:'rect',w:50,x:10,h:50,y:10,fill:'blue'}];
  elementsToRender: Array<string> = ['render/group'];
  groupModel = new GroupModel();
  keyProcessor = new InputKeyModel();
  bullet = new ShapeModel();

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
    this.simpleEl = new ShapeModel();
    this.simpleEl.setConfig({ type: 'rect', w: 50, x: 10, h: 50, y: 500, fill: 'blue' });
    console.log(this.simpleEl.config_obj);
    this.doSomething();
  }

  moveGrid(x:any,y:any) {
    this.groupModel.setPosition(x,y);
  }

  doSomething(): void {
    let gX = 10;
    let gY = 10;
    window.setInterval(() => {
      gX += 5;
      this.moveGrid(gX,gY);
    }, 200);
    let x = 10;
    let y = 500;
    window.setInterval(() => {
      if (this.keyProcessor.isKeyDown('ArrowRight')) {
        if (this.simpleEl.getPosition('x') < 1200) {
          x += 5;
          this.simpleEl.setPosition(x,y)
        }
      }
      if (this.keyProcessor.isKeyDown('ArrowLeft')) {
        if (this.simpleEl.getPosition('x') > 0) {
          x -= 5;
          this.simpleEl.setPosition(x,y);
        }
      }
      if (this.keyProcessor.isKeyDown('Space')) {
        console.log('a');
        this.bullet.setConfig({ type: 'rect', w: 50, x: 200, h: 50, y: 500, fill: 'blue' });
      }
      // this.groupModel.setAttribute('x',undefined,5);
    }, 16);
  }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'yourapp': Yourapp;
  }
}
