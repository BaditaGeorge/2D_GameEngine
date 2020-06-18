import Utilitars from 'game-engine/models/utility';
import { BoundingBox, ShapeInterface } from 'game-engine/models/shape-interface';


export class PhysicEngine {
    boundingBoxesMap: { [key: string]: Array<BoundingBox> } = {};
    //adaugam si aici interfata, imd
    map: {[key:string]:[number,string]} = {};
    arrayIndexes: {[key:string]:number} = {};
    utils: Utilitars = new Utilitars();
    linkMap: {[key:string]:Array<string>} = {};

    constructor() {

    }

    createBoundingBox(data: { [key: string]: number | string } | undefined, type: string | undefined) {
        let tempBoundBox: BoundingBox = { cornerX: [], cornerY: [] };
        if (data !== undefined && type !== undefined) {
            if (typeof data['x'] === 'number' && typeof data['y'] === 'number') {
                if (type === 'circle') {
                    if (typeof data['r'] === 'number') {
                        let radius = data['r'];
                        tempBoundBox.cornerX.push(data['x'] - radius);
                        tempBoundBox.cornerY.push(data['y'] - radius);
                        tempBoundBox.cornerX.push(data['x'] + radius);
                        tempBoundBox.cornerX.push(data['y'] + radius);
                    }
                } else if (type === 'rect') {
                    if (typeof data['w'] === 'number' && typeof data['h'] === 'number') {
                        let w = data['w'];
                        let h = data['h'];
                        tempBoundBox.cornerX.push(data['x']);
                        tempBoundBox.cornerY.push(data['y']);
                        tempBoundBox.cornerX.push(data['x'] + w);
                        tempBoundBox.cornerY.push(data['y'] + h);
                    }
                }
            }
        }
        return tempBoundBox;
    }

    setPosition(data: { [key: string]: number | string }, type: string | undefined, collisionClass: string) {
        let handler: BoundingBox | undefined = this.createBoundingBox(data, type);
        if (collisionClass !== undefined) {
            if (this.arrayIndexes[collisionClass] === undefined) {
                this.arrayIndexes[collisionClass] = 0;
            }
            if (this.linkMap === undefined) {
                this.linkMap = {};
            }
            if (this.boundingBoxesMap[collisionClass] === undefined) {
                this.boundingBoxesMap[collisionClass] = new Array<BoundingBox>();
            }
            if (handler !== undefined) {
                if (this.linkMap[collisionClass] === undefined) {
                    this.linkMap[collisionClass] = new Array<string>();
                }
                this.boundingBoxesMap[collisionClass].push(handler);
                //{[key:string]:Array<string>}
                this.linkMap[collisionClass].push(data['identifier'] + '');
                //{[key:string]:[number,string]}
                this.map[data['identifier']] = [this.arrayIndexes[collisionClass], collisionClass];
                this.arrayIndexes[collisionClass]++;
            }
        }
    }

    unsetPosition(data: { [key: string]: number | string }) {
        let actualIndex: number = this.map[data['identifier']][0];
        let collisionClass: string = this.map[data['identifier']][1];
        this.boundingBoxesMap[collisionClass][actualIndex].cornerX.clear();
        this.boundingBoxesMap[collisionClass][actualIndex].cornerY.clear();
        this.map[data['identifier']].clear();
        this.linkMap[collisionClass][actualIndex] = '';
    }

    unset(collisionClass: string, index: number) {
        if (this.linkMap[collisionClass] !== undefined) {
            if (this.linkMap[collisionClass][index] !== undefined) {
                this.boundingBoxesMap[collisionClass][index].cornerX.clear();
                this.boundingBoxesMap[collisionClass][index].cornerY.clear();
                this.map[this.linkMap[collisionClass][index]].clear();
                this.linkMap[collisionClass][index] = '';
                this.boundingBoxesMap[collisionClass].splice(index, 1);
                this.linkMap[collisionClass].splice(index, 1);
            }
        }
    }

    resetPosition(data: { [key: string]: number | string }, oldData: { [key: string]: number | string }, type: string | undefined) {
        let actualIndex: number = this.map[oldData['identifier']][0];
        let collisionClass: string = this.map[oldData['identifier']][1];
        this.map[oldData['identifier']].clear();
        this.map[data['identifier']] = [actualIndex, collisionClass];
        if (this.linkMap !== undefined) {
            if (this.linkMap[collisionClass] !== undefined) {
                this.linkMap[collisionClass][actualIndex] = data['identifier'] + '';
            }
        }
        this.boundingBoxesMap[collisionClass][actualIndex] = this.createBoundingBox(data, type);
    }

    isCollision(shape: ShapeInterface, collisionClass: string) {
        let data = Object.assign({}, shape.data);
        let type = shape.type.slice();
        let condition = (bInMove: BoundingBox, bObstacle: BoundingBox) => {
            if ((bObstacle.cornerX[1] < bInMove.cornerX[0] || bObstacle.cornerX[0] > bInMove.cornerX[1]) ||
                (bObstacle.cornerY[1] < bInMove.cornerY[0] || bObstacle.cornerY[0] > bInMove.cornerY[1])) {
                return false;
            }
            return true;
        }
        let movingBB: BoundingBox | undefined = this.createBoundingBox(data, type);
        if (movingBB !== undefined && this.boundingBoxesMap[collisionClass] !== undefined) {
            for (let i = 0; i < this.boundingBoxesMap[collisionClass].length; i++) {
                if (this.boundingBoxesMap[collisionClass][i].cornerX.length > 0) {
                    if (this.boundingBoxesMap[collisionClass][i] !== undefined) {
                        if (condition(movingBB, this.boundingBoxesMap[collisionClass][i]) === true) {
                            return i;
                        }
                    }
                }
            }
        }
        return -1;
    }

}

let PhysicEngineInterface = (function () {
    var instance: PhysicEngine;

    return {
        getInstance: function () {
            if (!instance) {
                instance = new PhysicEngine();
            }
            return instance;
        }
    }
})();

export default PhysicEngineInterface;