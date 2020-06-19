import Controller from '@ember/controller';
import ShapeModel from 'game-engine/models/shape-model';
import GroupModel from 'game-engine/models/group-model';
import InputKeyModel from 'game-engine/models/input-key-model';
import GameLoop from 'game-engine/models/game-loop';
import PhysicEngineInterface, { PhysicEngine } from 'game-engine/models/physicEngine';
import ResourceManagerInterface, { ResourceManager } from 'game-engine/models/resource-manager';

export default class Cargame extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  obstacle: { [key: string]: string | number } = { type: 'rect', w: 120, x: 0, h: 120, y: 0, fill: 'red' }
  obstacles: GroupModel = new GroupModel();
  threshold: number = 420;
  maxWidth: number = 500;
  onWIndexes: Array<number> = [0, 1, 2, 3];
  maxHeight: number = 900;
  gameLoop: GameLoop = new GameLoop();
  engine: PhysicEngine = PhysicEngineInterface.getInstance();
  isSet: boolean = false;
  vehicle: ShapeModel = new ShapeModel();
  inputKeyProcessor: InputKeyModel = new InputKeyModel();
  constructor() {
    super(...arguments);
    let missIndex: number = Math.floor(Math.random() * 4);
    let index: number = 0;
    this.obstacles.setCollisionClass('obstacles');
    for (let i = 0; i < 3; i++) {
      let tempObj: { [key: string]: string | number } = Object.assign({}, this.obstacle);
      if (index === missIndex) {
        index++;
      }
      tempObj['x'] = index * 125;
      index++;
      this.obstacles.addElement(tempObj);
    }
    this.vehicle.setConfig({ type: 'rect', w: 120, x: 375, h: 120, y: 720, fill: 'blue' });
    this.playGame();
  }

  createPositionalArray() {
    let missIndex: number = Math.floor(Math.random() * 4);
    let index: number = 0;
    let pos: Array<number> = [];
    while (index < 4) {
      if (index === missIndex) {
        index++;
      }
      pos.push(index * 125);
      index++;
    }
    return pos;
  }

  setFromTo(index: number, length: number) {
    let indexPA: number = 0;
    let posArray: Array<number> = this.createPositionalArray();
    console.log(posArray);
    for (let i = index; i < index + length; i++) {
      this.obstacles.setPositionAt(i, posArray[indexPA], 0);
      indexPA++;
    }
  }

  listenToInput() {
    let xVal: number|string = this.vehicle.getPosition('x');
    let currX:number = 0;
    if(typeof xVal === 'number'){
      currX = xVal;
    }
    if (this.inputKeyProcessor.isKeyDown('ArrowLeft')) {
      this.vehicle.setPosition(currX-125,720);
    } else if (this.inputKeyProcessor.isKeyDown('ArrowRight')) {
      this.vehicle.setPosition(currX+125,720);
    }
  }

  playGame() {
    let evn = () => {
      this.listenToInput();
      for (let i = 0; i < 3; i++) {
        let positional: { [key: string]: string | number } = this.obstacles.getPositionAt(i);
        if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
          this.obstacles.setPositionAt(i, positional['x'], positional['y'] + 10);
        }
        if (positional['y'] >= this.threshold) {
          if (this.isSet === false) {
            let missIndex: number = Math.floor(Math.random() * 4);
            let index: number = 0;
            for (let i = 3; i < 6; i++) {
              let tempObj: { [key: string]: string | number } = Object.assign({}, this.obstacle);
              if (index === missIndex) {
                index++;
              }
              tempObj['x'] = index * 125;
              index++;
              this.obstacles.addElement(tempObj);
            }
          }
          this.isSet = true;
        }
      }
      if (this.isSet === true) {
        for (let i = 3; i < 6; i++) {
          let positional: { [key: string]: string | number } = this.obstacles.getPositionAt(i);
          if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
            this.obstacles.setPositionAt(i, positional['x'], positional['y'] + 10);
          }
        }
      }
      if (this.obstacles.getPositionAt(0)['y'] >= 850) {
        this.setFromTo(0, 3);
      }
      if (this.obstacles.getPositionAt(3)['y'] >= 850) {
        this.setFromTo(3, 3);
      }
    };
    this.gameLoop.addLoop('race', evn, 100);
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'cargame': Cargame;
  }
}
