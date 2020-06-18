import { ShapeInterface } from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';
import PhysicEngineInterface, { PhysicEngine } from 'game-engine/models/physicEngine';
import ResourceManagerInterface, { ResourceManager } from './resource-manager';


export default class GroupModel {
  // normal class body definition here
  config_array: Array<ShapeInterface> = [];
  utils:Utilitars = new Utilitars();
  engine: PhysicEngine = PhysicEngineInterface.getInstance();
  isTouchable: boolean = false;
  collisionClass: string = '';
  additionalData: {[key:string]:string|number|Array<number>|Array<string>} = {};
  additionalDataArray: Array<{[key:string]:string|number|Array<number>|Array<string>}> = [];
  initialLength: number = 0;
  identifiers:Array<string> = new Array<string>();
  identifiersMap:{[key:string]:boolean} = {};
  resManager:ResourceManager = ResourceManagerInterface.getInstance();

  constructor() {

  }

  addElement(render_Obj: {[key:string]:number|string}) {
    this.config_array.pushObject(this.utils.processConfig(render_Obj));
    this.additionalDataArray.push({});
    this.initialLength++;
    let identifier:string = this.utils.createIdentifier('g');
    if(this.identifiersMap[identifier] === undefined || this.identifiersMap[identifier] === false){
      this.identifiersMap[identifier] = true;
    }else{
      while(this.identifiersMap[identifier] === true){
        identifier = this.utils.createIdentifier('g');
      }
      this.identifiersMap[identifier] = true;
    }
    // this.identifiers.push(identifier);
    this.config_array[this.config_array.length-1].data['identifier'] = identifier;
    if (this.isTouchable === true) {
      let len = this.config_array.length;
      this.engine.setPosition(this.config_array[len - 1].data, this.config_array[len - 1].type, this.collisionClass);
    }
  }

  setAdditionalData(key: string, dataField: string|number|Array<number>|Array<string>) {
    this.additionalData[key] = dataField;
  }

  getAdditionalData(key: string) {
    return this.additionalData[key];
  }

  setAdditionalDataAt(index: number, key: string, dataField: string|number|Array<number>|Array<string>) {
    this.additionalDataArray[index][key] = dataField;
  }

  getAdditionalDataAt(index: number, key: string) {
    return this.additionalDataArray[index][key];
  }

  getConfigAt(index: number) {
    return this.config_array[index];
  }

  setPositionAt(index: number, positionX: number, positionY: number) {
    let temporal_Arr: Array<ShapeInterface> = new Array<ShapeInterface>();
    this.copyArray(temporal_Arr, undefined);

    this.clear();
    for (let i = 0; i < temporal_Arr.length; i++) {
      let temporalConfig: ShapeInterface = { type: '', data: {}, fill: '' };
      temporalConfig.type = temporal_Arr[i].type.slice();
      if (temporal_Arr[i].fill !== undefined) {
        temporalConfig.fill = temporal_Arr[i].fill.slice();
      }
      temporalConfig.data = Object.assign({},temporal_Arr[i].data);
      if (i === index) {
        this.config_array.pushObject(this.utils.changeCoordinates(temporal_Arr[i], positionX, positionY));
      } else {
        this.config_array.pushObject(temporal_Arr[i]);
      }
      if (this.isTouchable === true) {
        this.engine.resetPosition(this.config_array[i].data, temporalConfig.data, this.config_array[i].type);
      }
    }
  }

  getPositionAt(index: number) {
    return { 'x': this.config_array[index].data['x'], 'y': this.config_array[index].data['y'] };
  }

  private copyArray(temporal_Arr: Array<ShapeInterface>, index: number | null | undefined) {
    for (let i = 0; i < this.config_array.length; i++) {
      if (index === null || index === undefined) {
        temporal_Arr.pushObject(Object.assign({}, this.config_array[i]));
      } else {
        if (index !== i) {
          temporal_Arr.pushObject(Object.assign({}, this.config_array[i]));
        }
      }
    }
  }

  setCollisionClass(collisionClass: string) {
    this.collisionClass = collisionClass;
    this.isTouchable = true;
  }

  getSize() {
    return this.config_array.length;
  }

  private clear() {
    this.config_array.clear();
  }

  setImageAt(index:number,key:string){
    let temporalData:string = '';
    let tempLoc:string = '';
    tempLoc = this.resManager.getUrlAt(key);
    if(this.config_array[index].fill.indexOf('#') === -1){
      let tempId:string = this.resManager.getUniqueId();
      temporalData = tempLoc + '#' + tempId;
      this.config_array[index].fill = temporalData.slice(); 
    }else{
      let tempId:string = this.config_array[index].fill.split('#')[1];
      temporalData = tempLoc + '#' + tempId;
      this.config_array[index].fill = temporalData.slice();
    }
  }

  setPosition(positionX: number, positionY: number) {
    let temporal_Arr: Array<ShapeInterface> = [];
    this.copyArray(temporal_Arr, undefined);
    if(typeof temporal_Arr[0].data['x'] !== 'number' || typeof temporal_Arr[0].data['y'] !== 'number'){
      return;
    }

    this.clear();
    let diffX:number = positionX - temporal_Arr[0].data['x'];
    let diffY:number = positionY - temporal_Arr[0].data['y'];
    for (let i = 0; i < temporal_Arr.length; i++) {
      let temporalConfig: ShapeInterface = { type: '', data: {}, fill: '' };
      temporalConfig.type = temporal_Arr[i].type.slice();
      if (temporal_Arr[i].fill !== undefined) {
        temporalConfig.fill = temporal_Arr[i].fill.slice();
      }
      if(typeof temporal_Arr[i].data['x'] !== 'number' || typeof temporal_Arr[i].data['y'] !== 'number'){
        return;
      }
      temporalConfig.data = Object.assign({},temporal_Arr[i].data);
      this.config_array.pushObject(this.utils.changeCoordinates(temporal_Arr[i], temporal_Arr[i].data['x'] + diffX, temporal_Arr[i].data['y'] + diffY));
      if (this.isTouchable === true) {
        this.engine.resetPosition(this.config_array[i].data, temporalConfig.data, this.config_array[i].type);
      }
    }
  }

  popElement(index: number | null | undefined) {
    if (index === undefined || index === null) {
      index = 0;
    }
    if(index >= this.config_array.length){
      return;
    }
    this.identifiersMap[this.config_array[index].data['identifier']] = false;
    this.config_array.splice(index, 1);
    this.additionalDataArray.splice(index, 1);
  }

  setFill(fillData: string, index: number | undefined = undefined) {
    if (index !== undefined && index < this.config_array.length) {
      let temporal_Arr: Array<ShapeInterface> = [];
      this.copyArray(temporal_Arr, undefined);

      this.clear();
      for (let i = 0; i < temporal_Arr.length; i++) {
        let temporalConfig: ShapeInterface = { type: '', data: {}, fill: '' };
        temporalConfig.type = temporal_Arr[i].type.slice();
        if (i !== index) {
          if (temporal_Arr[i].fill !== undefined) {
            temporalConfig.fill = temporal_Arr[i].fill.slice();
          }
        } else {
          temporalConfig.fill = fillData.slice();
        }
        temporalConfig.data = Object.assign({},temporal_Arr[i].data);
        this.config_array.pushObject(temporalConfig);
      }
    }
  }

}
