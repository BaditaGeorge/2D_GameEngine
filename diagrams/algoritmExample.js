/*
    -- config_Arr = [...]; -> obiectele cu care se vor initializa shape-urile unui grup
    -- modelObj = new GroupModel(config_Arr);
    -- playerObj = new ShapeModel(playerConfig_arr)
    -- bulletObj = {}; -> obiect ce contine parametrii pentru randarea unui glont pe ecran
    -- randarea se va face in cadrul componentei hbs --- (se vor lua elementele din this.modelObj.configArr)
    -- randarea pentru shape-ul player-ului se va face tot prin hbs, se va randa this.playerObj.configArr
    -- acum urmeaza procedura prin care se vor misca toate shape-urile deodata -- 
    let ok = 1;
    let addValue = 5;
    keyBinder = new keyBinder();
    window.setInterval(()=>{
        if(this.modelObj.getMaxX() <= 600 && this.modelObj.getMinX() >= 50){
            this.modelObj.setAttribute('x',undefined,addValue)
        }else{
            addValue = (-1)*addValue;
            this.modelObj.setAttribute('y',-5);
            this.modelObj.setAttribute('x',addValue);
        }
        if(keyBinder.isDown('RightArrow') === true){
            this.playerObj.setAttribute('x',5)
        }
        if(keyBinder.isDown('LeftArrow') === true){
            this.playerObj.setAttribute('x',-5);
        }
        if(keyBinder.isDown('Space') === true){
            if(this.playerObj.getLength() > 1){
                this.playerObj.addToRender(bulletObj);
            }
            this.playerObj.setAttribute('y',5);
        }
    },100);

*/