import { ShapeInterface } from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';
import PhysicEngineInterface from 'game-engine/models/physicEngine';
import ResourceManagerInterface, { ResourceManager } from './resource-manager';

export default class ShapeModel {
  // normal class body definition here
  config_obj: Array<ShapeInterface> = [];
  utils = new Utilitars();
  collisionClass:string = '';
  isTouchable:boolean = false;
  engine = PhysicEngineInterface.getInstance();
  resManager:ResourceManager = ResourceManagerInterface.getInstance();

  constructor() {
  }

  setConfig(config: {[key:string]:number|string}) {
    let configData: ShapeInterface = { type: '', data:{}, fill: '' };
    if (this.config_obj.length < 1) {
      configData = this.utils.processConfig(config);
      configData.data['identifier'] = this.utils.createIdentifier('a');
    }
    this.config_obj.pushObject(configData);
    if(this.isTouchable === true){
      this.engine.setPosition(configData.data, configData.type, this.collisionClass);
    }
    // console.log(Object.assign({}, configData));
  }

  getConfig() {
    return this.config_obj[0];
  }

  isSet() {
    if (this.config_obj.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  setCollisionClass(collisionClass:string){
    this.collisionClass = collisionClass;
    this.isTouchable = true;
  }

  setPosition(positionX: number, positionY: number) {
    let tempObj: ShapeInterface = Object.assign({}, this.config_obj[0]);
    let copyObject: ShapeInterface = {fill:'',type:'',data:{}};
    copyObject.fill = tempObj.fill.slice();
    copyObject.type = tempObj.type.slice();
    copyObject.data = Object.assign({},tempObj.data);
    this.config_obj.popObject();
    this.config_obj.pushObject(this.utils.changeCoordinates(tempObj, positionX, positionY));
    if(this.isTouchable === true){
      this.engine.resetPosition(this.config_obj[0].data, copyObject.data, this.config_obj[0].type)
    }
  }

  getField(key: string): number | string {
    if (this.config_obj[0].data !== undefined) {
      return this.config_obj[0].data[key];
    }
    return -1;
  }

  destroyObject() {
    this.config_obj.clear();
  }

  setImage(key:string){
    let temporalData:string = '';
    let tempLoc:string = '';
    tempLoc = this.resManager.getUrlAt(key);
    if(this.config_obj[0].fill.indexOf('#') === -1){
      let tempId:string = this.resManager.getUniqueId();
      temporalData = tempLoc + '#' + tempId;
      this.config_obj[0].fill = temporalData.slice(); 
    }else{
      let tempId:string = this.config_obj[0].fill.split('#')[1];
      temporalData = tempLoc + '#' + tempId;
      this.config_obj[0].fill = temporalData.slice();
    }
  }

  setFill(fillData: string) {
    let tempObj: ShapeInterface = Object.assign({}, this.config_obj[0]);
    this.config_obj.popObject();
    tempObj.fill = fillData;
    this.config_obj.pushObject(tempObj);
  }

  getPosition(key: string): number | string {
    if (this.config_obj[0].data !== undefined) {
      // if (key === 'x') {
      //   return this.config_obj[0].data[0];
      // } else if (key === 'y') {
      //   return this.config_obj[0].data[1];
      // } else {
      //   return -1;
      // }
      return this.config_obj[0].data[key];
    }
    return -1;
    // return this.config_obj[0][key];
  }
}

