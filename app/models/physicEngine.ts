import Utilitars from 'game-engine/models/utility';
import { BoundingBox, ShapeInterface } from 'game-engine/models/shape-interface';


class PhysicEngine {
    arrayIndex: number = 0;
    boundingBoxesMap: any = {};
    //adaugam si aici interfata, imd
    map: any = {};
    utils = new Utilitars();

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

    setPosition(data: Array<number> | undefined, type: string | undefined, collisionClass: string | undefined) {
        console.log('here');
        let handler: BoundingBox | undefined = this.createBoundingBox(data, type);
        if (collisionClass !== undefined) {
            if (this.boundingBoxesMap[collisionClass] === undefined) {
                this.boundingBoxesMap[collisionClass] = new Array<BoundingBox>();
            }
            if (handler !== undefined) {
                this.boundingBoxesMap[collisionClass].push(handler);
                this.map[JSON.stringify(data)] = [this.arrayIndex,collisionClass];
                this.arrayIndex++;
            }
        }
    }

    unsetPosition(data: Array<number> | undefined) {
        let stringifiedData: string = JSON.stringify(data);
        let actualIndex: number = this.map[stringifiedData][0];
        let collisionClass:string = this.map[stringifiedData][1];
        this.boundingBoxesMap[collisionClass][actualIndex].cornerX.clear();
        this.boundingBoxesMap[collisionClass][actualIndex].cornerY.clear();
        this.map[stringifiedData] = undefined;
    }

    resetPosition(data: Array<number> | undefined, oldData: Array<number> | undefined, type: string | undefined) {
        let stringifiedData: string = JSON.stringify(data);
        let stringifiedOldData: string = JSON.stringify(oldData);
        let actualIndex: number = this.map[stringifiedOldData][0];
        let collisionClass:string = this.map[stringifiedOldData][1];
        this.map[stringifiedOldData] = undefined;
        this.map[stringifiedData] = [actualIndex,collisionClass];
        this.boundingBoxesMap[collisionClass][actualIndex] = this.createBoundingBox(data, type);
    }

    isCollision(shape: ShapeInterface, collisionClass:string) {
        let data = shape.data.slice();
        let type = shape.type.slice();
        let condition = (bInMove: BoundingBox, bObstacle: BoundingBox) => {
            if ((bObstacle.cornerX[0] < bInMove.cornerX[0] && bObstacle.cornerY[0] < bInMove.cornerY[0] && bObstacle.cornerX[1] > bInMove.cornerX[0] && bObstacle.cornerY[1] > bInMove.cornerY[0]) ||
                (bObstacle.cornerX[0] < bInMove.cornerX[1] && bObstacle.cornerY[0] < bInMove.cornerY[0] && bObstacle.cornerX[1] > bInMove.cornerX[1] && bObstacle.cornerY[1] > bInMove.cornerY[0]) ||
                (bObstacle.cornerX[0] < bInMove.cornerX[1] && bObstacle.cornerY[0] < bInMove.cornerY[1] && bObstacle.cornerX[1] > bInMove.cornerX[1] && bObstacle.cornerY[1] > bInMove.cornerY[1]) ||
                (bObstacle.cornerX[0] < bInMove.cornerX[0] && bObstacle.cornerY[0] < bInMove.cornerY[1] && bObstacle.cornerX[1] > bInMove.cornerX[0] && bObstacle.cornerY[1] > bInMove.cornerY[1]) ||
                (bObstacle.cornerX[0] < bInMove.cornerX[0] && bObstacle.cornerX[1] > bInMove.cornerX[1] && (bObstacle.cornerY[0] === bInMove.cornerY[1] || bObstacle.cornerY[1] === bInMove.cornerY[0])) ||
                (bObstacle.cornerY[0] < bInMove.cornerY[0] && bObstacle.cornerY[1] > bInMove.cornerY[1] && (bObstacle.cornerX[0] === bInMove.cornerX[1] || bObstacle.cornerX[1] === bInMove.cornerX[0])) ||
                (bObstacle.cornerX[0] === bInMove.cornerX[0] && bObstacle.cornerX[1] === bInMove.cornerX[1] && bObstacle.cornerY[0] < bInMove.cornerY[0] && bObstacle.cornerY[1] > bInMove.cornerY[0]) ||
                (bObstacle.cornerX[0] === bInMove.cornerX[0] && bObstacle.cornerX[1] === bInMove.cornerX[1] && bObstacle.cornerY[0] < bInMove.cornerY[1] && bObstacle.cornerY[1] > bInMove.cornerY[1]) ||
                (bObstacle.cornerY[0] === bInMove.cornerY[0] && bObstacle.cornerY[1] === bInMove.cornerY[1] && bObstacle.cornerX[0] < bInMove.cornerX[0] && bObstacle.cornerX[1] > bInMove.cornerX[0]) || 
                (bObstacle.cornerY[0] === bInMove.cornerY[0] && bObstacle.cornerY[1] === bInMove.cornerY[1] && bObstacle.cornerX[0] < bInMove.cornerX[1] && bObstacle.cornerX[1] > bInMove.cornerX[1])) {
                return true;
            }
            return false;
        }
        let movingBB: BoundingBox | undefined = this.createBoundingBox(data, type);
        if (movingBB !== undefined && this.boundingBoxesMap[collisionClass] !== undefined) {
            for (let i = 0; i < this.boundingBoxesMap[collisionClass].length; i++) {
                if (this.boundingBoxesMap[collisionClass][i] !== undefined) {
                    if (condition(movingBB, this.boundingBoxesMap[collisionClass][i]) === true) {
                        return i;
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