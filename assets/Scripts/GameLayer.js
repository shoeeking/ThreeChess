let GameManager = require("GameLogic")
let Player = require("Player")
let FightAI = require("FightAI")

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
        BAI:FightAI,
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
        let data = {"A":[{"pointId":1,"alive":true},{"pointId":5,"alive":true},{"pointId":14,"alive":true},{"pointId":23,"alive":true}],"B":[{"pointId":2,"alive":true},{"pointId":8,"alive":false},{"pointId":7,"alive":true}],"step":8}     
        this.initPoints()
        this.initPlayer(this.AP,"A",data.A)
        this.initPlayer(this.BP,"B",data.B)
        this.roundStart(data.step)
    },
    initPoints(){
        let points = xx.gm.getPoints()
        for (var i = 0; i < points.length; i++) {
            let point = points[i]
            let node = cc.instantiate(this.pfPoint)
            node.position = this.getPointById(point)
            let script = node.getComponent("Point")
            script.init(point.pointId)
            script.onClick(this.pointEvent,this)
            this.node.addChild(node)
            if(point.columnId==1&&point.rowId==1){
                node.active = false
            }
        }
    },
    initPlayer(player,info,chessList){
        chessList = chessList || []

        player.init(info)
        for (var i = 0; i < chessList.length; i++) {
            let data = chessList[i]
            let chess = player.putChess(data.pointId)
            chess.position = this.getPointById(data.pointId)
            if(!data.alive){
                player.removeChess(data.pointId)
            }
            this.node.addChild(chess)
        }
    },
    getPointById(point){
        if(typeof point == "number"){
            point = xx.gm.getPoint(point)
        }
        let p = cc.p(-95*(point.rectId+1),95*(point.rectId+1))
        let o = cc.p(95*(point.rectId+1),95*(point.rectId+1))
        return cc.p(p.x+point.columnId*o.x,p.y-point.rowId*o.y)
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
            this.putChess(target.node.position,target.pointId)
        }else if(this.status==GS.MOVE){
            this.moveChess(target.node.position,target.pointId)
        }else if(this.status==GS.BAN){
            this.banChess(target.pointId)
        }
    },
    //落子
    putChess(point,pointId){
        if(xx.gm.getChess(pointId)){
            console.log("哪里有棋子")
            return
        }
        if(xx.gm.isHotPoint(pointId)){
            console.log("哪里是热窝,不能下")
            return
        }
        let player = this.getPlayer()
        let chess = player.putChess(pointId)
        chess.position = point
        this.node.addChild(chess)

        this.checkBan(chess)
    },
    //移子
    moveChess(point,pointId){
        // 选子
        if(!this.choiceChess){
            this.selectChess(pointId)
            return
        }
        //换子
        if(this.changeChess(pointId)){
            return
        }
        if(!xx.gm.canMove(this.choiceChess,pointId)){
            console.log("目标点不能以")
            return
        }
        let player = this.getPlayer()
        player.moveChess(pointId,this.choiceChess)
        let chess = this.choiceChess
        chess.node.position = point
        this.choiceChess = null

        this.checkBan(chess)
    },
    selectChess(pointId){
        let chess = xx.gm.getChess(pointId)
        if(!chess){
            console.log("移子，但是选择的是空子")
            return null
        }
        let player = this.getPlayer()
        if(!player.isMe(chess.playerId)){
            console.log("选的不是一边的棋子")
            return null
        }
        this.choiceChess = chess
        return chess
    },
    changeChess(pointId){
        if(this.choiceChess.pointId==pointId){
            console.log("换的是同一个子")
            return false
        }
        let player = this.getPlayer()
        let chess = xx.gm.getChess(pointId)
        if(chess&&player.isMe(chess.playerId)){
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
    banChess(pointId){
        let player = this.getPlayer(true)
        let chess = xx.gm.getChess(pointId)
        if(!chess){
            console.log("不能拿空子")
            return false
        }
        if(!player.isMe(chess.playerId)){
            console.log("不能拿自己的棋子")
            return false
        }
        if(!player.canRemove(pointId)){
            console.log("不能拿别人的成三子")
            return
        }

        if(player.removeChess(pointId)){
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
        let player = this.getPlayer()
        if(!player.isPutOver()){
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

    roundStart(step){
        this.stepIndex = step || 1
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
        this.aFlag.string = this.AP.alive+"/"+this.AP.chessList.length
        this.bFlag.string = this.BP.alive+"/"+this.BP.chessList.length
    },
    printEvent(){
        // let data = {}
        // data.A = this.AP.log()
        // data.B = this.BP.log()
        // data.step = this.stepIndex
        // console.log(JSON.stringify(data))
        this.BAI.AI()
    },
});
