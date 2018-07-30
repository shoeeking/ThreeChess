let Player = require("Player")
cc.Class({
    extends: cc.Component,
    properties: {
        pfChess:cc.Prefab,
        flag:0,
        nickname:""
    },
    ctor(){
        this.playerId = 0
        this.chessList = []
        this.alive = 0
    },
    init(playerId){
        this.playerId= playerId
        this.chessList = []
    },
    putChess(pointId){
        let chess = cc.instantiate(this.pfChess)
        let script = chess.getComponent('Chess')
        script.setPlayer(this.playerId,this.chessList.length,this.flag)
        xx.gm.put(pointId,script)
        this.chessList.push(chess)
        this.alive++
        return chess
    },
    moveChess(pointId,chess){
        xx.gm.move(pointId,chess)
    },
    removeChess(pointId){
        let chess = xx.gm.getChess(pointId)
        xx.gm.remove(chess)
        this.alive--
        return true
    },
    isOver(){
        return this.isAllDie()||this.isNoWay()
    },
    isAllDie(){
        if(this.chessList.length<9)return false
        return this.alive<3
    },
    isNoWay(){
        if(this.chessList.length<9)return false
        for (var i = 0; i < this.chessList.length; i++) {
            let chess = this.chessList[i].getComponent("Chess")
            if(!chess.isDie()&&xx.gm.getWay(chess.pointId).length>0){
                return false
            }
        }
        return true
    },
    isPutOver(){
        return this.chessList.length>=9
    },
    isMe(playerId){
        return this.playerId==playerId
    },
    log(){
        let info = []
        for (var i = 0; i < this.chessList.length; i++) {
            let chess = this.chessList[i].getComponent("Chess")
            info.push({pointId:chess.pointId,alive:!chess.isDie()})
        }
        return info
    },
    canRemove(pointId){
        let chess = xx.gm.getChess(pointId)
        let three = xx.gm.getThree(chess)
        // 不是成三子
        if(three.length==0)return true
        // 或者的子全部都是成三子
        if(this.isAllThree(three)){
            return true
        }
        return false
    },
    isAllThree(threeList){
        function concatArray(src,dst){
            dst = dst || []
            for (var i = 0; i < src.length; i++) {
                dst = dst.concat(src[i])
            }
            return dst
        }
        let list = concatArray(threeList)

        for (var i = 0; i < this.chessList.length; i++) {
            let script = this.chessList[i].getComponent("Chess")
            if(script.isDie())continue;
            if(list.indexOf(script.pointId)>-1)continue;
            let tlist = xx.gm.getThree(script)
            if(tlist.length==0)return false;
            tlist = concatArray(tlist,tlist)
        }
        return true
    }

});

