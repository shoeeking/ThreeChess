cc.Class({
    extends: cc.Component,
    properties: {
        pfChess:cc.Prefab,
        flag:0,
        nickname:""
    },
    ctor(){
        this.id = 0
        this.chesses = []
        this.chessIndex = 0
        this.alive = 0
    },
    init(playerId){
        this.id= playerId
        this.chesses = []
    },
    newChess(pointId){
        let chess = cc.instantiate(this.pfChess)
        let script = chess.getComponent('Chess')
        script.setPlayer(this.id,this.chessIndex++,this.flag)
        xx.gm.put(pointId,script)
        this.chesses.push(chess)
        this.alive++
        return chess
    },
    move(id,chess){
        xx.gm.move(id,chess)
    },
    remove(id){
        let chess = xx.gm.getChess(id)
        if(!chess){
            console.log("不能拿空子")
            return false
        }
        if(chess.playerId!=this.id){
            console.log("不能拿自己的棋子")
            return false
        }
        chess.node.active = false
        xx.gm.remove(chess)
        this.alive--
        return true
    },
    isOver(){
        return this.isAllDie()||this.isNoWay()
    },
    isAllDie(){
        if(this.chesses.length<9)return false
        return this.alive<3
    },
    isNoWay(){
        if(this.chesses.length<9)return false
        for (var i = 0; i < this.chesses.length; i++) {
            let chess = this.chesses[i].getComponent("Chess")
            if(!chess.isDie()&&xx.gm.getWay(chess.pointId).length>0){
                return false
            }
        }
        return true
    }

});

