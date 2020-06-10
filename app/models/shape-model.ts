import { ShapeInterface } from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';

export default class ShapeModel {
  // normal class body definition here
  config_obj: Array<ShapeInterface> = [];
  utils = new Utilitars();

  constructor() {
  }

  setConfig(config: any) {
    let configData: ShapeInterface = {type:'',data:[],fill:''};
    if (this.config_obj.length < 1) {
      configData = this.utils.processConfig(config);
    }
    this.config_obj.pushObject(configData);
    // console.log(Object.assign({}, configData));
  }

  getConfig(){
    return this.config_obj[0];
  }

  isSet() {
    if (this.config_obj.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  setPosition(positionX: number, positionY: number) {
    let tempObj: ShapeInterface = Object.assign({}, this.config_obj[0]);
    // console.log(this.config_obj[0]);
    this.config_obj.popObject();
    // if (this.config_obj[0].data !== undefined) {
    //   console.log(this.config_obj[0]);
    //   let tmp: ShapeInterface = {};
    //   tmp.data = this.config_obj[0].data.slice();
    //   tmp.type = this.config_obj[0].type;
    //   // while(this.config_obj[0].data.length > 0){
    //   //   this.config_obj[0].data.popObject();
    //   // }
    //   this.config_obj[0].data = [];
    //   let tmpDt: Array<number> | undefined = this.utils.changeCoordinates(tmp, positionX, positionY).data;
    //   // console.log(tmpDt);
    //   // if(tmpDt !== undefined){
    //   //   for(let i=0;i<tmpDt.length;i++){
    //   //     this.config_obj[0].data.pushObject(tmpDt[i]);
    //   //   }
    //   // }
    //   if (tmpDt !== undefined) {
    //     this.config_obj[0].data = tmpDt.slice();
    //   }
    // }
    this.config_obj.pushObject(this.utils.changeCoordinates(tempObj,positionX,positionY));
  }

  destroyObject() {
    this.config_obj.clear();
  }

  setFill(fillData: string) {
    let tempObj: ShapeInterface = Object.assign({}, this.config_obj[0]);
    this.config_obj.popObject();
    tempObj.fill = fillData;
    this.config_obj.pushObject(tempObj);
  }

  getPosition(key: string): number {
    if (this.config_obj[0].data !== undefined) {
      if (key === 'x') {
        return this.config_obj[0].data[0];
      } else if (key === 'y') {
        return this.config_obj[0].data[1];
      } else {
        return -1;
      }
    } else {
      return -1;
    }
    // return this.config_obj[0][key];
  }
}

