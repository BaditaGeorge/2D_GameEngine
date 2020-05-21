import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ShapeService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  @tracked config_obj:Array<any> = [];

  constructor(){
    super(...arguments);
  }

  setConfig(config:any){
    if(this.config_obj.length < 1){
      this.config_obj.pushObject(config);
    }
  }

  setAttribute(key:string,value:any,upDate:number){
    let tempObj:any = Object.assign({},this.config_obj[0]);
    this.config_obj.popObject();
    if(value === undefined || value === null){
      tempObj[key] += upDate;
    }else{
      tempObj[key] = value;
    }
    this.config_obj.pushObject(tempObj);
  }

  getAttribute(key:string){
    return this.config_obj[0][key];
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'shape-service': ShapeService;
  }
}
