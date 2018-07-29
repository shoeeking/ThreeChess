cc.Class({
    extends: cc.Component,

    properties: {
        frames:{
            default:[],
            type:cc.SpriteFrame
        }
    },
    ctor(){
        this.chessId = 0 // 棋子序号
        this.playerId = 0
        this.pointId = 0
        this.status = 1 //0死了，1活着
    },
    setPlayer(playerId,chessId,txtId){
        this.chessId = chessId
        this.playerId = playerId
        this.getComponent(cc.Sprite).spriteFrame = this.frames[txtId]
    },
    put(pId){
        this.pointId= pId
    },
    die(){
        this.node.active = false
        this.status = 0
    },
    isDie(){
        return this.status==0
    },
    isOnePlayer(chess){
        return chess.playerId==this.playerId
    }

    // update (dt) {},
});
