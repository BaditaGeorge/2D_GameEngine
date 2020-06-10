import { ShapeInterface } from 'game-engine/models/shape-interface';

export default class Utilitars {
    processConfig(config: any) {
        let configData: ShapeInterface = {type:'',data:[],fill:''};
        configData.fill = config['fill'];
        configData.type = config['type'];
        if (config['type'] === 'rect') {
            configData.data = [config['x'], config['y'], config['w'], config['h']];
        } else if (config['type'] === 'circle') {
            configData.data = [config['cx'], config['cy'], config['r']];
        } else {
            configData.data = config['points'];
        }
        return configData;
    }

    changeCoordinates(tempObj: ShapeInterface, positionX: number, positionY: number) {
        if (tempObj.type === 'rect' || tempObj.type === 'circle') {
            if (tempObj.data !== undefined) {
                tempObj.data[0] = positionX;
                tempObj.data[1] = positionY;
            }
        } else {
            if (tempObj.data !== undefined) {
                let posDiffs: Array<number> = [];
                for (let i = 0; i < tempObj.data.length - 2; i += 2) {
                    posDiffs.push(tempObj.data[i] - tempObj.data[i + 2]);
                    posDiffs.push(tempObj.data[i + 1] - tempObj.data[i + 3]);
                }
                tempObj.data[0] = positionX;
                tempObj.data[1] = positionY;
                for (let i = 2; i < tempObj.data.length; i++) {
                    tempObj.data[i] = tempObj.data[i - 2] + posDiffs[i - 2];
                    tempObj.data[i + 1] = tempObj.data[i - 1] + posDiffs[i - 1];
                }
            }
        }
        return tempObj;
    }
}