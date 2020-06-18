import Utilitars from "./utility";


export class ResourceManager{
    imageMap:{[key:string]:string} = {};
    utils:Utilitars = new Utilitars();
    identifiersMap:{[key:string]:boolean} = {};

    constructor(){

    }

    setUrl(key:string,location:string){
        this.imageMap[key] = location;
    }

    getUrlAt(key:string){
        return this.imageMap[key];
    }

    getUniqueId(){
        let id:string = this.utils.createIdentifier('r');
        if(this.identifiersMap[id] === undefined){
            this.identifiersMap[id] = true;
        }else{
            while(this.identifiersMap[id] === true){
                id = this.utils.createIdentifier('r');
            }
            this.identifiersMap[id] = true;
        }
        return id;
    }
}

let ResourceManagerInterface = (function () {
    var instance: ResourceManager;

    return {
        getInstance: function () {
            if (!instance) {
                instance = new ResourceManager();
            }
            return instance;
        }
    }
})();

export default ResourceManagerInterface;
