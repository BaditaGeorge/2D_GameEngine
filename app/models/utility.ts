import { ShapeInterface } from 'game-engine/models/shape-interface';

export default class Utilitars {
    processConfig(config: { [key: string]: number | string }) {
        let configData: ShapeInterface = { type: '', data: {}, fill: '' };
        if (typeof config['fill'] === 'string') {
            configData.fill = config['fill'];
        }
        if (typeof config['type'] === 'string') {
            configData.type = config['type'];
        }
        if (config['type'] === 'rect') {
            if (typeof config['x'] === 'number' && typeof config['y'] === 'number' && typeof config['w'] === 'number' && typeof config['h'] === 'number') {
                configData.data = { x: config['x'], y: config['y'], w: config['w'], h: config['h'] };
            }
        } else if (config['type'] === 'circle') {
            if (typeof config['cx'] === 'number' && typeof config['cy'] === 'number' && typeof config['r'] === 'number') {
                configData.data = { x: config['cx'], y: config['cy'], r: config['r'] };
            }
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

    createIdentifier(firstLetter:string|undefined){
        let randIdentifier:string = '';
        let toAdd:number = 97;
        if(firstLetter !== undefined){
            randIdentifier += firstLetter;
            for(let i=0;i<5;i++){
                let randVal:number = Math.floor(Math.random()*26);
                randIdentifier += String.fromCharCode(randVal+toAdd);
            }
        }
        return randIdentifier;
    }
}