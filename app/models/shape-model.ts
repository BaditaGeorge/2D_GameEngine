import { ShapeInterface } from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';

export default class ShapeModel {
  // normal class body definition here
  config_obj: Array<ShapeInterface> = [];
  utils = new Utilitars();

  constructor() {
  }

  setConfig(config: any) {
    let configData: ShapeInterface = {};
    if (this.config_obj.length < 1) {
      configData = this.utils.processConfig(config); 
    }
    this.config_obj.pushObject(configData);
    console.log(Object.assign({}, configData));
  }

  setPosition(positionX: number, positionY: number) {
    let tempObj: ShapeInterface = Object.assign({}, this.config_obj[0]);
    this.config_obj.popObject();
    this.config_obj.pushObject(this.utils.changeCoordinates(tempObj,positionX,positionY));
  }

  getPosition(key: string):number {
    if (this.config_obj[0].data !== undefined) {
      if (key === 'x') {
        return this.config_obj[0].data[0];
      } else if (key === 'y') {
        return this.config_obj[0].data[1];
      } else {
        return 0;
      }
    }else{
      return 0;
    }
    // return this.config_obj[0][key];
  }
}

