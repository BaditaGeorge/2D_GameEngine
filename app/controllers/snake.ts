import Controller from '@ember/controller';
import ShapeModel from 'game-engine/models/shape-model';
import GroupModel from 'game-engine/models/group-model';
import InputKeyModel from 'game-engine/models/input-key-model';
import GameLoop from 'game-engine/models/game-loop';
import PhysicEngineInterface, { PhysicEngine } from 'game-engine/models/physicEngine';
import ResourceManagerInterface, { ResourceManager } from 'game-engine/models/resource-manager';

export default class Snake extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  snake: GroupModel = new GroupModel();
  gameMatrix: Array<Array<string>> = new Array<Array<string>>();
  maxWidth: number = 1400;
  maxHeight: number = 1000;
  direction: string = 'r';
  inputKey: InputKeyModel = new InputKeyModel();
  gameLoop: GameLoop = new GameLoop();
  moveUnit: number = 50;
  eatableX:number = Math.floor(Math.random()*27)*this.moveUnit;
  eatableY:number = Math.floor(Math.random()*19)*this.moveUnit;
  eatable:ShapeModel = new ShapeModel();


  constructor() {
    super(...arguments);
    this.snake.addElement({ type: 'rect', w: 50, x: 0, h: 50, y: 0, fill: 'blue' });
    for (let i: number = 0; i < this.maxHeight / 50; i++) {
      this.gameMatrix.push(Array<string>());
      for (let j: number = 0; j < this.maxWidth / 50; j++) {
        this.gameMatrix[i].push('');
      }
    }
    this.gameMatrix[0][0] = this.direction;
    this.gameMatrix[this.eatableY/this.moveUnit][this.eatableX/this.moveUnit] = 'e';
    this.eatable.setConfig({type:'rect',w:50,x:this.eatableX,h:50,y:this.eatableY,fill:'yellow'});
    this.playGame();
  }

  playGame() {
    let inGame = () => {
      let positional: { [key: string]: string | number } = this.snake.getPositionAt(0);
      let cellDir: string = '';
      if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
        cellDir = this.gameMatrix[positional['y']/this.moveUnit][positional['x']/this.moveUnit];
      }
      let xVal:number = 0;
      let yVal:number = 0;
      if(typeof positional['x'] === 'number' && typeof positional['y'] === 'number'){
        xVal = positional['x'];
        yVal = positional['y'];
      }
      console.log(xVal,yVal);
      if(cellDir === 'r'){
        xVal += this.moveUnit;
      }else if(cellDir === 'l'){
        xVal -= this.moveUnit;
      }else if(cellDir === 'u'){
        yVal -= this.moveUnit;
      }else if(cellDir === 'd'){
        yVal += this.moveUnit;
      }
      this.gameMatrix[yVal/this.moveUnit][xVal/this.moveUnit] = '';
      if (this.inputKey.isKeyDown('ArrowLeft')) {
        this.direction = 'l';
      } else if (this.inputKey.isKeyDown('ArrowRight')) {
        this.direction = 'r';
      } else if (this.inputKey.isKeyDown('ArrowUp')) {
        this.direction = 'u';
      } else if (this.inputKey.isKeyDown('ArrowDown')) {
        this.direction = 'd';
      }
      this.gameMatrix[yVal/this.moveUnit][xVal/this.moveUnit] = this.direction;
      this.snake.setPositionAt(0,xVal,yVal);
    };
    this.gameLoop.addLoop('inGame', inGame, 100);
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'snake': Snake;
  }
}
