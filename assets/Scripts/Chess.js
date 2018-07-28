// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        frames:{
            default:[],
            type:cc.SpriteFrame
        }
    },
    ctor(){
        this.id = 0 // 棋子序号
        this.playerId = 0
        this.pointId = 0
        this.status = 1 //0死了，1活着
    },

    setPlayer(playerId,id,txtId){
        this.id = id
        this.playerId = playerId
        this.getComponent(cc.Sprite).spriteFrame = this.frames[txtId]
    },
    put(pId){
        this.pointId= pId
    },
    die(){
        this.status = 1
    },
    isDie(){
        return this.status==0
    },
    isOnePlayer(chess){
        return chess.playerId==this.playerId
    }

    // update (dt) {},
});
