
let LayerManager = cc.Class({
    ctor(){

    },
    pop(layer,zorder){
        if(typeof(layer)==="string"){
            //预制体
        }else if(layer instanceof cc.Prefab){
            
        }
        let scene = cc.director.getRunningScene()
        layer.setLocalZOrder(zorder)
        scene.addChild(layer)
    },
});

module.exports = LayerManager
