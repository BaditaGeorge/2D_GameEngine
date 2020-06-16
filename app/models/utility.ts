import { ShapeInterface } from 'game-engine/models/shape-interface';

export default class Utilitars {
    processConfig(config: any) {
        let configData: ShapeInterface = {type:'',data:{},fill:''};
        configData.fill = config['fill'];
        configData.type = config['type'];
        if (config['type'] === 'rect') {
            configData.data = {x:config['x'], y:config['y'], w:config['w'], h:config['h']};
        } else if (config['type'] === 'circle') {
            configData.data = {x:config['cx'], y:config['cy'], r:config['r']};
        } else {
            configData.data = config['points'];
        }
        return configData;
    }

    changeCoordinates(tempObj: ShapeInterface, positionX: number, positionY: number) {
        if (tempObj.type === 'rect' || tempObj.type === 'circle') {
            if (tempObj.data !== undefined) {
                tempObj.data['x'] = positionX;
                tempObj.data['y'] = positionY;
            }
        }
        return tempObj;
    }
}