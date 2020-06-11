import Utilitars from 'game-engine/models/utility';
import { BoundingBox, ShapeInterface } from 'game-engine/models/shape-interface';


class PhysicEngine {
    boundingBoxesMap: any = {};
    //adaugam si aici interfata, imd
    map: any = {};
    arrayIndexes: any = {};
    utils = new Utilitars();
    linkMap: any = {};

    constructor() {
        this.boundingBoxesMap = {};
    }

    createBoundingBox(data: Array<number> | undefined, type: string | undefined) {
        let tempBoundBox: BoundingBox = { cornerX: [], cornerY: [] };
        if (data !== undefined && type !== undefined) {
            if (type === 'circle') {
                let radius = data[2];
                tempBoundBox.cornerX.push(data[0] - radius);
                tempBoundBox.cornerY.push(data[1] - radius);
                tempBoundBox.cornerX.push(data[0] + radius);
                tempBoundBox.cornerX.push(data[1] + radius);
            } else if (type === 'rect') {
                let w = data[2];
                let h = data[3];
                tempBoundBox.cornerX.push(data[0]);
                tempBoundBox.cornerY.push(data[1]);
                tempBoundBox.cornerX.push(data[0] + w);
                tempBoundBox.cornerY.push(data[1] + h);
            }
        }
        return tempBoundBox;
    }

    setPosition(data: Array<number> | undefined, type: string | undefined, collisionClass: string) {
        let handler: BoundingBox | undefined = this.createBoundingBox(data, type);
        if (collisionClass !== undefined) {
            if(this.arrayIndexes[collisionClass] === undefined){
                this.arrayIndexes[collisionClass] = 0;
            }
            if (this.boundingBoxesMap[collisionClass] === undefined) {
                this.boundingBoxesMap[collisionClass] = new Array<BoundingBox>();
            }
            if (handler !== undefined) {
                if (this.linkMap[collisionClass] === undefined) {
                    this.linkMap[collisionClass] = new Array<string>();
                }
                this.boundingBoxesMap[collisionClass].push(handler);
                this.linkMap[collisionClass].push(JSON.stringify(data));
                this.map[JSON.stringify(data)] = [this.arrayIndexes[collisionClass], collisionClass];
                this.arrayIndexes[collisionClass]++;
            }
        }
    }

    unsetPosition(data: Array<number> | undefined) {
        let stringifiedData: string = JSON.stringify(data);
        let actualIndex: number = this.map[stringifiedData][0];
        let collisionClass: string = this.map[stringifiedData][1];
        this.boundingBoxesMap[collisionClass][actualIndex].cornerX.clear();
        this.boundingBoxesMap[collisionClass][actualIndex].cornerY.clear();
        this.map[stringifiedData] = undefined;
        this.linkMap[collisionClass][actualIndex] = undefined;
    }

    unset(collisionClass: string, index: number) {
        if (this.linkMap[collisionClass][index] !== undefined) {
            this.boundingBoxesMap[collisionClass][index].cornerX.clear();
            this.boundingBoxesMap[collisionClass][index].cornerY.clear();
            this.map[this.linkMap[collisionClass][index]] = undefined;
            this.linkMap[collisionClass][index] = undefined;
            this.boundingBoxesMap[collisionClass].splice(index,1);
            this.linkMap[collisionClass].splice(index,1);
        }
    }

    resetPosition(data: Array<number> | undefined, oldData: Array<number> | undefined, type: string | undefined) {
        let stringifiedData: string = JSON.stringify(data);
        let stringifiedOldData: string = JSON.stringify(oldData);
        let actualIndex: number = this.map[stringifiedOldData][0];
        let collisionClass: string = this.map[stringifiedOldData][1];
        this.map[stringifiedOldData] = undefined;
        this.map[stringifiedData] = [actualIndex, collisionClass];
        this.linkMap[collisionClass][actualIndex] = stringifiedData;
        this.boundingBoxesMap[collisionClass][actualIndex] = this.createBoundingBox(data, type);
    }

    isCollision(shape: ShapeInterface, collisionClass: string) {
        let data = shape.data.slice();
        let type = shape.type.slice();
        let condition = (bInMove: BoundingBox, bObstacle: BoundingBox) => {
            if((bObstacle.cornerX[1] < bInMove.cornerX[0] || bObstacle.cornerX[0] > bInMove.cornerX[1]) || 
            (bObstacle.cornerY[1] < bInMove.cornerY[0] || bObstacle.cornerY[0] > bInMove.cornerY[1])){
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
    var instance: any;

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