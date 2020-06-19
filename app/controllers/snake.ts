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
  eatableX: number = Math.floor(Math.random() * 27) * this.moveUnit;
  eatableY: number = Math.floor(Math.random() * 19) * this.moveUnit;
  eatable: ShapeModel = new ShapeModel();
  headIndex: number = 0;
  engine: PhysicEngine = PhysicEngineInterface.getInstance();
  grows: boolean = false;


  constructor() {
    super(...arguments);
    this.snake.setCollisionClass('snake');
    this.snake.addElement({ type: 'rect', w: 50, x: 0, h: 50, y: 0, fill: 'blue' });
    for (let i: number = 0; i < this.maxHeight / 50; i++) {
      this.gameMatrix.push(Array<string>());
      for (let j: number = 0; j < this.maxWidth / 50; j++) {
        this.gameMatrix[i].push('');
      }
    }
    this.gameMatrix[0][0] = this.direction;
    this.gameMatrix[this.eatableY / this.moveUnit][this.eatableX / this.moveUnit] = 'e';
    this.eatable.setConfig({ type: 'rect', w: 50, x: this.eatableX, h: 50, y: this.eatableY, fill: 'yellow' });
    this.playGame();
  }

  computePosition(cellDir: string, x: number, y: number) {
    let xVal: number = x;
    let yVal: number = y;
    if (cellDir === 'r') {
      xVal += this.moveUnit;
    } else if (cellDir === 'l') {
      xVal -= this.moveUnit;
    } else if (cellDir === 'u') {
      yVal -= this.moveUnit;
    } else if (cellDir === 'd') {
      yVal += this.moveUnit;
    }
    return [xVal, yVal];
  }

  moveSnake() {
    let positional: { [key: string]: string | number } = this.snake.getPositionAt(0);
    let cellDir: string = '';
    if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
      cellDir = this.gameMatrix[positional['y'] / this.moveUnit][positional['x'] / this.moveUnit];
    }
    let xVal: number = 0;
    let yVal: number = 0;
    let currX: number = 0;
    let currY: number = 0;
    if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
      currX = positional['x'];
      currY = positional['y'];
    }
    xVal = this.computePosition(cellDir, currX, currY)[0];
    yVal = this.computePosition(cellDir, currX, currY)[1];
    this.gameMatrix[yVal / this.moveUnit][xVal / this.moveUnit] = this.direction;
    this.snake.setPositionAt(0, xVal, yVal);
    for (let i = 1; i < this.snake.getSize(); i++) {
      positional = this.snake.getPositionAt(i);
      xVal = currX;
      yVal = currY;
      if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
        currX = positional['x'];
        currY = positional['y'];
      }
      this.snake.setPositionAt(i, xVal, yVal);
    }
  }

  playGame() {
    let inGame = () => {
      let positional: { [key: string]: string | number } = this.snake.getPositionAt(this.headIndex);
      let xVal: number = 0;
      let yVal: number = 0;
      if (typeof positional['x'] === 'number' && typeof positional['y'] === 'number') {
        xVal = positional['x'];
        yVal = positional['y'];
      }
      xVal = this.computePosition(this.gameMatrix[yVal / this.moveUnit][xVal / this.moveUnit], xVal, yVal)[0];
      yVal = this.computePosition(this.gameMatrix[yVal / this.moveUnit][xVal / this.moveUnit], xVal, yVal)[1];
      if (xVal < 0 || yVal < 0 || xVal >= 1400 || yVal >= 1000 || this.engine.isCollisionInClass('snake') !== -1) {
        let snakeLen:number = this.snake.getSize();
        for (let i = 0; i < snakeLen; i++) {
          this.engine.unset('snake', 0);
          let tempPositional: { [key: string]: string | number } = this.snake.getPositionAt(0);
          let xTmp: number = -1;
          let yTmp: number = -1;
          if (typeof tempPositional['x'] === 'number' && typeof tempPositional['y'] === 'number') {
            xTmp = tempPositional['x'];
            yTmp = tempPositional['y'];
          }
          if (xTmp >= 0 && yTmp >= 0 && xTmp < 1400 && yTmp < 1000) {
            this.gameMatrix[yTmp / this.moveUnit][xTmp / this.moveUnit] = '';
          }
          this.snake.popElement(0);
        }
        this.snake.addElement({ type: 'rect', w: 50, x: 0, h: 50, y: 0, fill: 'blue' });
        this.direction = 'r';
        this.gameMatrix[0][0] = this.direction;
      } else {
        if (this.engine.isCollision(this.eatable.getConfig(), 'snake') !== -1) {
          if (typeof this.eatableX === 'number' && typeof this.eatableY === 'number') {
            this.eatableX = Math.floor(Math.random() * 27) * this.moveUnit;
            this.eatableY = Math.floor(Math.random() * 19) * this.moveUnit;
            this.gameMatrix[this.eatableY / this.moveUnit][this.eatableX / this.moveUnit] = 'e';
            this.eatable.setPosition(this.eatableX, this.eatableY);
            this.grows = true;
          }
        }
        if (this.inputKey.isKeyDown('ArrowLeft')) {
          if (this.direction !== 'r') {
            this.direction = 'l';
          }
        } else if (this.inputKey.isKeyDown('ArrowRight')) {
          if (this.direction !== 'l') {
            this.direction = 'r';
          }
        } else if (this.inputKey.isKeyDown('ArrowUp')) {
          if (this.direction !== 'd') {
            this.direction = 'u';
          }
        } else if (this.inputKey.isKeyDown('ArrowDown')) {
          if (this.direction !== 'u') {
            this.direction = 'd';
          }
        }
        let len: number = this.snake.getSize() - 1;
        let lastPostion: { [key: string]: string | number } = this.snake.getPositionAt(len);
        this.moveSnake();
        if (this.grows === true) {
          this.grows = false;
          if (typeof lastPostion['x'] === 'number' && typeof lastPostion['y'] === 'number') {
            this.snake.addElement({ type: 'rect', w: 50, x: lastPostion['x'], h: 50, y: lastPostion['y'], fill: 'blue' });
          }
        }
      }
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
