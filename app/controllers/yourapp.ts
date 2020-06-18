import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';

import ShapeModel from 'game-engine/models/shape-model';
import GroupModel from 'game-engine/models/group-model';
import InputKeyModel from 'game-engine/models/input-key-model';
import GameLoop from 'game-engine/models/game-loop';
import PhysicEngineInterface, { PhysicEngine } from 'game-engine/models/physicEngine';
import ResourceManagerInterface, { ResourceManager } from 'game-engine/models/resource-manager';

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
  bullet:ShapeModel = new ShapeModel();
  gameLoop:GameLoop = new GameLoop();
  shields: Array<GroupModel> = [];
  engine: PhysicEngine | undefined = undefined;
  alienBullets: GroupModel = new GroupModel();
  resManager:ResourceManager =ResourceManagerInterface.getInstance();

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
    this.simpleEl.setCollisionClass('ship');
    this.simpleEl.setConfig({ type: 'rect', w: 50, x: 10, h: 50, y: 600, fill: 'blue' });
    this.doSomething();
  }

  moveGrid(x: number, y: number, v:number) {
    this.groupModel.setPosition(x, y);
    for(let i=0;i<5;i++){
      for(let j=0;j<5;j++){
        this.groupModel.setImageAt(i*5+j,'bigA'+v);
      }
    }
  }

  doSomething(): void {
    this.resManager.setUrl('bigA0','api/bigAlien1.png');
    this.resManager.setUrl('bigA1','api/bigAlien2.png');
    this.resManager.setUrl('ship','api/battleShip.png');
    this.resManager.setUrl('inv','api/bman.png');
    this.simpleEl.setImage('ship');
    let gX = 10;
    let gY = 10;
    let v:number = 0;
    for(let i:number=0;i<5;i++){
      for(let j:number=0;j<5;j++){
        this.groupModel.setImageAt(i*5+j,'bigA0');
      }
    }
    let evGrid = () => {
      gX += 5;
      v = 1 - v;
      this.moveGrid(gX, gY, v);
    }
    this.gameLoop.addLoop('moveGrid', evGrid, 200);
    let x = 10;
    let y = 600;
    let poss: Array<number> = [];
    let matrixOfInvs: Array<Array<boolean>> = [];
    for (let i = 0; i < 5; i++) {
      matrixOfInvs.push([]);
      for (let j = 0; j < 5; j++) {
        matrixOfInvs[i].push(true);
      }
    }
    // this.groupModel.setImageAt(0,'bigA0');
    let atTick: number = 0;
    let ev = () => {
      let spawningPosition: number = Math.floor(Math.random() * 5);
      let lowerBounder: number = 4;
      if (this.alienBullets.getSize() < 3) {
        if (matrixOfInvs[lowerBounder][spawningPosition] === true) {
          let positionalObj: { [key: string]: number | string } = this.groupModel.getPositionAt(lowerBounder * 5 + spawningPosition);
          this.alienBullets.addElement({ type: 'rect', w: 15, h: 50, x: positionalObj['x'], y: positionalObj['y'], fill: 'red' });
          if (typeof positionalObj['x'] === 'number' && typeof positionalObj['y'] === 'number') {
            poss.push(positionalObj['x']);
            poss.push(positionalObj['y']);
          }
        } else {
          while (lowerBounder >= 0 && matrixOfInvs[lowerBounder][spawningPosition] === false) {
            lowerBounder--;
          }
          let positionalObj: { [key: string]: number | string } = this.groupModel.getPositionAt(lowerBounder * 5 + spawningPosition);
          this.alienBullets.addElement({ type: 'rect', w: 15, h: 50, x: positionalObj['x'], y: positionalObj['y'], fill: 'red' });
          if (typeof positionalObj['x'] === 'number' && typeof positionalObj['y'] === 'number') {
            poss.push(positionalObj['x']);
            poss.push(positionalObj['y']);
          }
        }
      }
    }
    let infall = () => {
      if (this.engine === undefined) {
        return;
      }
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
              if (this.shields[j].getAdditionalDataAt(tIndex, 'damaged') === undefined) {
                this.shields[j].setAdditionalDataAt(tIndex, 'damaged', 1);
                this.shields[j].setFill('yellow', tIndex);
              } else {
                let damage: number | string | Array<string> | Array<number> = this.shields[j].getAdditionalDataAt(tIndex, 'damaged');
                if (typeof damage === 'number') {
                  if (damage < 3) {
                    damage = this.shields[j].getAdditionalDataAt(tIndex,'damaged');
                    if(typeof damage !== 'number'){
                      return;
                    }
                    this.shields[j].setAdditionalDataAt(tIndex, 'damaged', damage + 1);
                  } else {
                    this.shields[j].popElement(tIndex);
                    this.engine.unset('shields' + j, tIndex);
                  }
                }
              }
              toPop.push(i);
              break;
            }
          }
          if (tIndex === -1) {
            tIndex = this.engine.isCollision(this.alienBullets.getConfigAt(i), 'ship');
            if (tIndex !== -1) {
              toPop.push(i);
              // this.simpleEl.setFill('yellow');
            }
          }
        } else {
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
      if (this.engine === undefined) {
        return;
      }
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
          let tempY: number|string = this.bullet.getPosition('y');
          let tempX: number|string = this.bullet.getPosition('x');
          if (typeof tempY === 'number' && typeof tempX === 'number') {
            tempY -= 10;
            this.bullet.setPosition(tempX, tempY);
          }
        } else {
          if (targetIndex !== -1) {
            if (colliSion === 'invaders') {
              // this.groupModel.setFill('yellow', targetIndex);
              matrixOfInvs[Math.floor(targetIndex / 5)][targetIndex % 5] = false;
            } else if (colliSion === 'shields0') {
              this.shields[0].setFill('yellow', targetIndex);
              if (this.shields[0].getAdditionalDataAt(targetIndex, 'damaged') === undefined) {
                this.shields[0].setAdditionalDataAt(targetIndex, 'damaged', 1);
              } else {
                let damageInd: number | string | Array<number> | Array<string> = this.shields[0].getAdditionalDataAt(targetIndex, 'damaged');
                if (damageInd < 3) {
                  damageInd = this.shields[0].getAdditionalDataAt(targetIndex,'damaged');
                  if (typeof damageInd === 'number') {
                    this.shields[0].setAdditionalDataAt(targetIndex, 'damaged', damageInd + 1);
                  }
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
