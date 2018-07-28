let GameManager = require("GameLogic")
let Player = require("Player")

let GS = cc.Enum({
    IDLE:-1,//待机
    PUT:-1,//落子
    MOVE:-1,//移动
    OVER:-1,//结束
    BAN:-1,//拔子
})
cc.Class({
    extends: cc.Component,

    properties: {
        pfPoint:cc.Prefab,
        aFlag:cc.Label,
        bFlag:cc.Label,
        AP:Player,
        BP:Player,
        txtStatus:cc.Label,
    },
    ctor(){
        if(!xx.gm){
            xx.gm = new GameManager()
        }
        this.status = GS.IDLE
        this.banNum = 0
        this.choiceChess = null
    },
    onLoad () {
        this.initPoints()
        this.initPlayer()
        this.roundStart()
    },
    initPoints(){
        let points = xx.gm.getPoints()
        for (var i = 0; i < points.length; i++) {
            let point = points[i]
            let p = cc.p(-95*(point.rectId+1),95*(point.rectId+1))
            let o = cc.p(95*(point.rectId+1),95*(point.rectId+1))
            let node = cc.instantiate(this.pfPoint)
            node.position = cc.p(p.x+point.columnId*o.x,p.y-point.rowId*o.y)
            let script = node.getComponent("Point")
            script.init(point.id)
            script.onClick(this.pointEvent,this)
            this.node.addChild(node)
            if(point.columnId==1&&point.rowId==1){
                node.active = false
            }
        }
    },
    initPlayer(){
        this.AP.init("A")
        this.BP.init("B")
    },
    getPlayer(isEmeny){
        let isA = this.isAStep()
        isA = isEmeny?!isA:isA
        return isA?this.AP:this.BP
    },
    isAStep(){
        return this.stepIndex%2==1
    },

    pointEvent(target){
        if(this.status==GS.PUT){
            this.putChess(target.node.position,target.id)
        }else if(this.status==GS.MOVE){
            this.moveChess(target.node.position,target.id)
        }else if(this.status==GS.BAN){
            this.banChess(target.id)
        }
    },
    //落子
    putChess(point,id){
        if(xx.gm.getChess(id)){
            console.log("哪里有棋子")
            return
        }
        let player = this.getPlayer()
        let chess = player.newChess(id)
        chess.position = point
        this.node.addChild(chess)

        this.checkBan(chess)
    },
    //移子
    moveChess(point,id){
        // 选子
        if(!this.choiceChess){
            this.selectChess(id)
            return
        }
        //换子
        if(this.changeChess(id)){
            return
        }
        if(!xx.gm.canMove(this.choiceChess,id)){
            console.log("目标点不能以")
            return
        }
        let player = this.getPlayer()
        player.move(id,this.choiceChess)
        let chess = this.choiceChess
        chess.node.position = point
        this.choiceChess = null

        this.checkBan(chess)
    },
    selectChess(id){
        let chess = xx.gm.getChess(id)
        if(!chess){
            console.log("移子，但是选择的是空子")
            return null
        }
        let player = this.getPlayer()
        if(chess.playerId!=player.id){
            console.log("选的不是一边的棋子")
            return null
        }
        this.choiceChess = chess
        return chess
    },
    changeChess(id){
        if(this.choiceChess.pointId==id){
            console.log("换的是同一个子")
            return false
        }
        let player = this.getPlayer()
        let chess = xx.gm.getChess(id)
        if(chess&&chess.playerId==player.id){
            this.choiceChess = chess
            return true
        }
        return false
    },
    //拿子
    checkBan(chess){
        this.banNum = this.checkThree(chess)
        if(this.banNum==0){
            this.nextStep()
            return false
        }
        this.setStatus(GS.BAN)
        return true
    },
    banChess(id){
        let player = this.getPlayer(true)
        if(player.remove(id)){
            this.banNum--
        }

        if(this.banNum<=0){
            this.nextStep()
        } 
    },

    checkThree(chess){
        let script = chess.getComponent("Chess")
        let three = xx.gm.getThree(script)
        return three.length
    },
    checkNormalStatus(){
        if(this.stepIndex<=18){
            this.setStatus(GS.PUT)
        }else{
            this.setStatus(GS.MOVE)
        }
    },
    setStatus(status){
        if(status!=null){
            this.status = status
        }

        let player = this.getPlayer()
        switch(this.status){
            case GS.IDLE:
                this.txtStatus.string="正在准备..."
                break
            case GS.PUT:
                this.txtStatus.string=player.nickname+"落子"
                break
            case GS.MOVE:
                this.txtStatus.string=player.nickname+"走"
                break
            case GS.BAN:
                this.txtStatus.string=player.nickname+"吃子"
                break
            default:
                this.txtStatus.string="游戏结束"
                break
        }
    },

    roundStart(){
        this.stepIndex = 1
        this.setStatus(GS.PUT)
    },
    nextStep(){
        let enemy = this.getPlayer(true)
        if(enemy.isOver()){
            let player = this.getPlayer()
            console.log("游戏结束,"+player.nickname+"获胜")
            this.setStatus(GS.OVER)
        }
        this.stepIndex++
        this.checkNormalStatus()
    },
    update (dt) {
        this.aFlag.string = this.AP.alive+"/"+this.AP.chesses.length
        this.bFlag.string = this.BP.alive+"/"+this.BP.chesses.length
    },
});
