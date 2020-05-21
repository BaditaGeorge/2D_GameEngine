import Service from '@ember/service';

export default class InputKeyProcessor extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  keysDown:any = {};
  keysUp:any = {};
  keyDictionary:any = {
    "Space":32,
    "ArrowLeft":37,
    "ArrowUp":38,
    "ArrowRight":39,
    "ArrowDown":40
  }
  
  constructor(){
    super(...arguments);
    this.dispachWaiters();
  }

  private dispachWaiters(){
    window.addEventListener('keydown',(e)=>{
      this.keysDown[e.keyCode] = true;
    });

    window.addEventListener('keyup',(e)=>{
      this.keysDown[e.keyCode] = undefined;
      this.keysUp[e.keyCode] = true;
    });
  }

  private checkIfKey(key:string|number,keyObject:any){
    if(typeof key === 'string'){
      if(this.keyDictionary[key] !== undefined){
        if(keyObject[this.keyDictionary[key]] === true){
          return true;
        }
      }else{
        if(keyObject[key.charCodeAt(0)] === true){
          return true;
        }
      }
    }else{
      if(keyObject[key] === true){
        return true;
      }
    }
    return false;
  }

  isKeyDown(key:string|number){
    return this.checkIfKey(key,this.keysDown);
  }

  isKeyUp(key:string|number){
    return this.checkIfKey(key,this.keysUp);
  }
  
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'input-key-processor': InputKeyProcessor;
  }
}
