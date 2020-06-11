import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';

import ShapeModel from 'game-engine/models/shape-model';
import GroupModel from 'game-engine/models/group-model';
import InputKeyModel from 'game-engine/models/input-key-model';
import GameLoop from 'game-engine/models/game-loop';
import PhysicEngineInterface from 'game-engine/models/physicEngine';

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
  gameLoop = new GameLoop();
  shields: Array<GroupModel> = [];
  engine: any = undefined;
  alienBullets: any = new GroupModel();

  constructor() {
    super(...arguments);
    this.engine = PhysicEngineInterface.getInstance();
    // this.groupModel.addElement({type:'rect',w:50,x:10,h:50,y:10,fill:'blue'});
    // this.groupModel.addElement({type:'rect',w:50,x:65,h:50,y:10,fill:'blue'});
    let basicObj = { type: 'rect', w: 50, x: 10, h: 50, y: 10 };
    this.groupModel.setCollisionClass('invaders');
    this.alienBullets.setCollisionClass('binvaders');
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.groupModel.addElement(Object.assign({}, basicObj));
        basicObj['x'] += 65;
      }
      basicObj['x'] = 10;
      basicObj['y'] += 55;
    }
    let basicShield = { type: 'rect', w: 50, x: 55, h: 50, y: 360 };
    let x = 0;
    for (let i = 0; i < 3; i++) {
      let shieldObj = Object.assign({}, basicShield);
      this.shields.push(new GroupModel());
      this.shields[i].setCollisionClass('shields' + i);
      for (let j = 0; j < 3; j++) {
        for (let t = 0; t < 3; t++) {
          if (j == 2) {
            if (t != 1) {
              this.shields[i].addElement(shieldObj);
            }
          } else {
            this.shields[i].addElement(shieldObj);
          }
          shieldObj['x'] += 55;
        }
        x = shieldObj['x'] + 95;
        shieldObj['x'] = basicShield['x'];
        shieldObj['y'] += 55;
      }
      basicShield['x'] = x;
    }

    this.simpleEl = new ShapeModel();
    this.simpleEl.setConfig({ type: 'rect', w: 50, x: 10, h: 50, y: 600, fill: 'blue' });
    this.doSomething();
  }

  moveGrid(x: any, y: any) {
    this.groupModel.setPosition(x, y);
  }

  doSomething(): void {
    let gX = 10;
    let gY = 10;
    let evGrid = () => {
      gX += 5;
      this.moveGrid(gX, gY);
    }
    this.gameLoop.addLoop('moveGrid', evGrid, 200);
    let x = 10;
    let y = 600;
    let poss: Array<number> = [];
    let matrixOfInvs: any = [];
    for (let i = 0; i < 5; i++) {
      matrixOfInvs.push([]);
      for (let j = 0; j < 5; j++) {
        matrixOfInvs[i].push(true);
      }
    }
    let atTick: number = 0;
    let ev = () => {
      let spawningPosition: number = Math.floor(Math.random() * 5);
      let lowerBounder: number = 4;
      if (this.alienBullets.getSize() < 3) {
        if (matrixOfInvs[lowerBounder][spawningPosition] === true) {
          let positionalObj: any = this.groupModel.getPositionAt(lowerBounder * 5 + spawningPosition);
          this.alienBullets.addElement({ type: 'rect', w: 15, h: 50, x: positionalObj['x'], y: positionalObj['y'], fill: 'red' });
          poss.push(positionalObj['x']);
          poss.push(positionalObj['y']);
        } else {
          while (lowerBounder >= 0 && matrixOfInvs[lowerBounder][spawningPosition] === false) {
            lowerBounder--;
          }
          let positionalObj: any = this.groupModel.getPositionAt(lowerBounder * 4 + spawningPosition);
          this.alienBullets.addElement({ type: 'rect', w: 15, h: 50, x: positionalObj['x'], y: positionalObj['y'], fill: 'red' });
          poss.push(positionalObj['x']);
          poss.push(positionalObj['y']);
        }
      }
    }
    let infall = () => {
      atTick++;
      if (atTick === 30) {
        atTick = 0;
        ev();
      }
      let tIndex: number = -1;
      let toPop: Array<number> = [];
      for (let i = 0; i < this.alienBullets.getSize(); i++) {
        poss[i * 2 + 1] += 10;
        if (poss[i * 2 + 1] < 720) {
          this.alienBullets.setPositionAt(i, poss[i * 2], poss[i * 2 + 1]);
          for (let j = 0; j < 3; j++) {
            tIndex = this.engine.isCollision(this.alienBullets.getConfigAt(i), ('shields' + j));
            if (tIndex !== -1) {
              this.shields[j].setFill('yellow', tIndex);
              toPop.push(i);
              break;
            }
          }
        }else{
          toPop.push(i);
        }
      }
      for (let i = 0; i < toPop.length; i++) {
        this.alienBullets.popElement(toPop[i]);
        poss.splice(toPop[i] * 2, 2);
      }
    }
    // this.gameLoop.addLoop('fall', ev, 200);
    this.gameLoop.addLoop('infall', infall, 30);
    let keyEvents = () => {
      if (this.bullet.isSet() === true) {
        let targetIndex: number = this.engine.isCollision(this.bullet.getConfig(), 'invaders');
        let colliSion: string = 'invaders';
        if (targetIndex === -1) {
          for (let i = 0; i < this.shields.length; i++) {
            targetIndex = this.engine.isCollision(this.bullet.getConfig(), ('shields' + i));
            if (targetIndex !== -1) {
              colliSion = 'shields' + i;
              break;
            }
          }
        }
        if (targetIndex === -1 && this.bullet.getPosition('y') >= 0) {
          let tempY = this.bullet.getPosition('y');
          let tempX = this.bullet.getPosition('x');
          tempY -= 5;
          this.bullet.setPosition(tempX, tempY);
        } else {
          if (targetIndex !== -1) {
            if (colliSion === 'invaders') {
              this.groupModel.setFill('yellow', targetIndex);
              matrixOfInvs[Math.floor(targetIndex / 5)][targetIndex % 5] = false;
            } else if (colliSion === 'shields0') {
              this.shields[0].setFill('yellow', targetIndex);
              if (this.shields[0].getAdditionalDataAt(targetIndex, 'damaged') === undefined) {
                this.shields[0].setAdditionalDataAt(targetIndex, 'damaged', 1);
              } else {
                let damageInd: number = this.shields[0].getAdditionalDataAt(targetIndex, 'damaged');
                if (damageInd < 3) {
                  this.shields[0].setAdditionalDataAt(targetIndex, 'damaged', damageInd + 1);
                } else {
                  this.shields[0].popElement(targetIndex);
                  this.engine.unset(colliSion, targetIndex);
                }
              }
            } else if (colliSion === 'shields1') {
              this.shields[1].setFill('yellow', targetIndex);
            } else if (colliSion === 'shields2') {
              this.shields[2].setFill('yellow', targetIndex);
            }
          }
          this.bullet.destroyObject();
        }
      }

      if (this.keyProcessor.isKeyDown('ArrowRight')) {
        if (this.simpleEl.getPosition('x') < 1200) {
          x += 10;
          this.simpleEl.setPosition(x, y)
        }
      }
      if (this.keyProcessor.isKeyDown('ArrowLeft')) {
        if (this.simpleEl.getPosition('x') > 0) {
          x -= 10;
          this.simpleEl.setPosition(x, y);
        }
      }
      if (this.keyProcessor.isKeyDown('Space')) {
        // console.log('a');
        if (this.bullet.isSet() === false) {
          this.bullet.setConfig({ type: 'rect', w: 15, x: (this.simpleEl.getPosition('x') + this.simpleEl.getField('w') / 2), h: 50, y: this.simpleEl.getPosition('y'), fill: 'blue' });
        }
        // this.groupModel.setFill('red',3);
      }
      if (this.keyProcessor.isKeyDown('A')) {
        this.gameLoop.changeLoopFrequency('moveGrid', 200);
      }
    }
    this.gameLoop.addLoop('keyEvents', keyEvents, 16);
  }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'yourapp': Yourapp;
  }
}
