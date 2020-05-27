import {ShapeInterface} from 'game-engine/models/shape-interface';
import Utilitars from 'game-engine/models/utility';

export default class GroupModel {
  // normal class body definition here
  config_array:Array<any> = [];
  utils = new Utilitars();

  constructor(){
    
  }

  addElement(render_Obj:any){
    this.config_array.pushObject(this.utils.processConfig(render_Obj));
  }

  private copyArray(temporal_Arr:Array<ShapeInterface>,index:number|null|undefined){
    for(let i=0;i<this.config_array.length;i++){
      if(index === null || index === undefined){
        temporal_Arr.pushObject(Object.assign({},this.config_array[i]));
      }else{
        if(index !== i){
          temporal_Arr.pushObject(Object.assign({},this.config_array[i]));
        }
      }
    }
  }

  private clear(){
    this.config_array.clear();
  }

  setPosition(positionX:number,positionY:number){
    let temporal_Arr:Array<any> = [];
    this.copyArray(temporal_Arr,undefined);

    this.clear();
    let diffX = positionX - temporal_Arr[0].data[0];
    let diffY = positionY - temporal_Arr[0].data[1];
    console.log(diffX,diffY);
    for(let i=0;i<temporal_Arr.length;i++){
      this.config_array.pushObject(this.utils.changeCoordinates(temporal_Arr[i],temporal_Arr[i].data[0]+diffX,temporal_Arr[i].data[1]+diffY));
    }
  }

  popElement(index:number|null|undefined){
    let temporal_Arr:Array<any> = [];
    if(index === undefined || index === null){
      index = 0;
    }
    this.copyArray(temporal_Arr,index);
    this.clear();
    this.config_array.pushObjects(temporal_Arr);
  }

  // removeElementAt(index:number){
  //   let temporal_Arr:Array<any> = [];
  //   for(let i=0;i<this.config_array.length;i++){
      
  //   }
  // }

}
