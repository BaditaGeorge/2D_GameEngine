import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GroupService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  @tracked config_array:Array<any> = [];

  constructor(){
    super(...arguments);
  }

  addElement(render_Obj:any){
    this.config_array.pushObject(render_Obj);
  }

  private copyArray(temporal_Arr:Array<any>,index:number|null|undefined){
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

  setAttribute(key:string,value:any,upDate:number){
    let temporal_Arr:Array<any> = [];
    this.copyArray(temporal_Arr,undefined);

    this.clear();

    for(let i=0;i<temporal_Arr.length;i++){
      if(value === undefined || value === null){
        temporal_Arr[i][key] += upDate;
      }else{
        temporal_Arr[i][key] = value;
      }
      this.config_array.pushObject(temporal_Arr[i]);
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

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'group-service': GroupService;
  }
}
