import { ShapeInterface } from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';
import PhysicEngineInterface from 'game-engine/models/physicEngine';

export default class GroupModel {
  // normal class body definition here
  config_array: Array<any> = [];
  utils = new Utilitars();
  engine: any = PhysicEngineInterface.getInstance();
  isTouchable: boolean = false;
  collisionClass: string = '';
  additionalData: any = {};
  additionalDataArray:Array<any> = [];

  constructor() {

  }

  addElement(render_Obj: any) {
    this.config_array.pushObject(this.utils.processConfig(render_Obj));
    this.additionalDataArray.push({});
    if (this.isTouchable === true) {
      let len = this.config_array.length;
      this.engine.setPosition(this.config_array[len - 1].data, this.config_array[len - 1].type, this.collisionClass);
    }
  }

  setAdditionalData(key:string,dataField:any){
    this.additionalData[key] = dataField;
  }

  getAdditionalData(key:string){
    return this.additionalData[key];
  }

  setAdditionalDataAt(index:number,key:string,dataField:any){
    this.additionalDataArray[index][key] = dataField;
  }

  getAdditionalDataAt(index:number,key:string){
    return this.additionalDataArray[index][key];
  }
  
  setPositionAt(index:number,positionX:number,positionY:number){
    let tempObject:ShapeInterface = Object.assign({},this.config_array[index]);
    let tempConfig:ShapeInterface = {fill:'',data:[],type:''};
    tempConfig.fill = tempObject.fill.slice();
    tempConfig.data = tempObject.data.slice();
    tempConfig.type = tempObject.type.slice();
    this.config_array.splice(index,1);
    this.config_array.splice(index,0,this.utils.changeCoordinates(Object.assign({},tempObject), positionX,positionY));
    if (this.isTouchable === true) {
      this.engine.resetPosition(this.config_array[index].data, tempConfig.data, this.config_array[index].type);
    }
    // let temporal_Arr: Array<any> = [];
    // this.copyArray(temporal_Arr, undefined);

    // this.clear();
    // let diffX = positionX - temporal_Arr[0].data[0];
    // let diffY = positionY - temporal_Arr[0].data[1];
    // for (let i = 0; i < temporal_Arr.length; i++) {
    //   let temporalConfig: ShapeInterface = { type: '', data: [], fill: '' };
    //   temporalConfig.type = temporal_Arr[i].type.slice();
    //   if (temporal_Arr[i].fill !== undefined) {
    //     temporalConfig.fill = temporal_Arr[i].fill.slice();
    //   }
    //   temporalConfig.data = temporal_Arr[i].data.slice();
    //   this.config_array.pushObject(this.utils.changeCoordinates(temporal_Arr[i], temporal_Arr[i].data[0] + diffX, temporal_Arr[i].data[1] + diffY));
    //   if (this.isTouchable === true) {
    //     this.engine.resetPosition(this.config_array[i].data, temporalConfig.data, this.config_array[i].type);
    //   }
    // }
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

  private clear() {
    this.config_array.clear();
  }

  setPosition(positionX: number, positionY: number) {
    let temporal_Arr: Array<any> = [];
    this.copyArray(temporal_Arr, undefined);

    this.clear();
    let diffX = positionX - temporal_Arr[0].data[0];
    let diffY = positionY - temporal_Arr[0].data[1];
    for (let i = 0; i < temporal_Arr.length; i++) {
      let temporalConfig: ShapeInterface = { type: '', data: [], fill: '' };
      temporalConfig.type = temporal_Arr[i].type.slice();
      if (temporal_Arr[i].fill !== undefined) {
        temporalConfig.fill = temporal_Arr[i].fill.slice();
      }
      temporalConfig.data = temporal_Arr[i].data.slice();
      this.config_array.pushObject(this.utils.changeCoordinates(temporal_Arr[i], temporal_Arr[i].data[0] + diffX, temporal_Arr[i].data[1] + diffY));
      if (this.isTouchable === true) {
        this.engine.resetPosition(this.config_array[i].data, temporalConfig.data, this.config_array[i].type);
      }
    }
  }

  popElement(index: number | null | undefined) {
    if (index === undefined || index === null) {
      index = 0;
    }
    this.config_array.splice(index, 1);
    this.additionalDataArray.splice(index,1);
    // let temporal_Arr:Array<any> = [];
    // if(index === undefined || index === null){
    //   index = 0;
    // }
    // this.copyArray(temporal_Arr,index);
    // this.clear();
    // this.config_array.pushObjects(temporal_Arr);
  }

  setFill(fillData: string, index: number | undefined = undefined) {
    // if (index === undefined) {
    //   for (let i = 0; i < this.config_array.length; i++) {
    //     this.config_array[i].fill = fillData;
    //   }
    // } else {
    //   if (index < this.config_array.length) {
    //     this.config_array[index].fill = fillData;
    //   }
    // }
    if (index !== undefined && index < this.config_array.length) {
      let temporal_Arr: Array<any> = [];
      this.copyArray(temporal_Arr, undefined);

      this.clear();
      for (let i = 0; i < temporal_Arr.length; i++) {
        let temporalConfig: ShapeInterface = { type: '', data: [], fill: '' };
        temporalConfig.type = temporal_Arr[i].type.slice();
        if (i !== index) {
          if (temporal_Arr[i].fill !== undefined) {
            temporalConfig.fill = temporal_Arr[i].fill.slice();
          }
        } else {
          temporalConfig.fill = fillData.slice();
        }
        temporalConfig.data = temporal_Arr[i].data.slice();
        this.config_array.pushObject(temporalConfig);
      }
    }
    // console.log(fillData,index);
    // if (index !== undefined) {
    //   let tempObject: ShapeInterface = Object.assign({}, this.config_array[index]);
    //   tempObject.fill = fillData;
    //   this.config_array.splice(index,1);
    //   this.config_array.splice(index,0,tempObject);
    // }
  }

  // removeElementAt(index:number){
  //   let temporal_Arr:Array<any> = [];
  //   for(let i=0;i<this.config_array.length;i++){

  //   }
  // }

}
