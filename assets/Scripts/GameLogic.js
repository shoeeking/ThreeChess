
//逻辑层
let GameLogic = cc.Class({
    ctor(){
        this.pointList = []
        for(var i=0;i<3;i++){
            for(var j=0;j<9;j++){
                let point = {}
                point.id = i*9+j
                point.rectId = i
                point.placeId = j
                point.rowId = Math.floor(j/3)
                point.columnId = Math.floor(j%3)
                this.pointList[point.id] = point
            }
        }
        this.chessList = []
    },
    getPoint(id){
        return this.pointList[id]
    },
    getPoints(){
        return this.pointList
    },
    put(id,chess){
        this.chessList.push(chess)
        this.pointList[id].chess = chess
        chess.put(id)
    },
    move(id,chess){
        this.pointList[chess.pointId].chess = null
        this.pointList[id].chess = chess
        chess.put(id)
    },
    remove(chess){
        chess.die()
        this.pointList[chess.pointId].chess = null
    },
    getChess(pointId){
        let point = this.pointList[pointId]
        if(!point){
            console.log("坐标有问题，要查一查",pointId)
            return null
        }
        return point.chess
    },
    getThree(chess){
        let threeList = []
        let rowList = this.isRectRow(chess.pointId)
        let columnList = this.isRectColumn(chess.pointId)
        let pointList = this.isSamePoint(chess.pointId)
        rowList && threeList.push(rowList)
        columnList && threeList.push(columnList)
        pointList && threeList.push(pointList)
        return threeList
    },
    isOK(idList){
        if(!idList || idList.length==0)return false
        let chess = this.getChess(idList[0])
        if(!chess)return false
        for(var i=1;i<idList.length;i++){
            let newChess = this.getChess(idList[i])
            if(!newChess||!newChess.isOnePlayer(chess)){
                return false
            }
        }
        return true
    },
    isRectRow(id){
        let point = this.getPoint(id)
        let rId = point.rectId*9 + point.rowId*3
        let list = [rId,rId+1,rId+2]
        if(this.isOK(list)){
            return list
        }
        return null
    },
    isRectColumn(id){
        let point = this.getPoint(id)
        let cId = point.rectId*9 + point.columnId
        let list = [cId,cId+3*1,cId+3*2]
        if(this.isOK(list)){
            return list
        }
        return null
    },
    isSamePoint(id){
        let point = this.getPoint(id)
        let pId = point.placeId
        let exportId=[0,2,4,6,8]
        if (exportId.indexOf(pId)>=0){
            return null
        }
        let list = [pId,pId+9*1,pId+9*2]
        if(this.isOK(list)){
            return list
        }
        return null
    },
    canMove(chess,id){
        //位置相同
        if(chess.pointId==id)return false
        //目标位置有棋子
        if(this.getChess(id))return false

        let point0 = this.getPoint(chess.pointId)
        let point1 = this.getPoint(id)
        // 同一个矩形内，只判断内部序号
        if(point0.rectId==point1.rectId){
            return Math.abs(point0.columnId-point1.columnId)+Math.abs(point0.rowId-point1.rowId)==1
        }else if(Math.abs(point0.rectId-point1.rectId)==1){
            let exportId=[0,2,4,6,8]
            // 矩形角落不能跨层移动
            if (exportId.indexOf(point0.id)>=0){
                return false
            }
            return (point0.columnId==point1.columnId)&&(point0.rowId==point1.rowId)
        }
        return false
    },
    getWay(id){
        let point = this.getPoint(id)
        let points=[]
        if(point.placeId==4)return points
        //圈内
        //上
        if(point.rowId>0&&this.isEmptyPoint(id-3)){
            points.push(id-3)
        }
        //下
        if(point.rowId<2&&this.isEmptyPoint(id+3)){
            points.push(id+3)
        }
        //左
        if(point.columnId>0&&this.isEmptyPoint(id-1)){
            points.push(id-1)
        }
        //右
        if(point.columnId<2&&this.isEmptyPoint(id+1)){
            points.push(id+1)
        }
        //圈外
        let exportId=[0,2,4,6,8]
        if (exportId.indexOf(point.placeId)==-1){
            //内圈
            if(point.rectId>0&&this.isEmptyPoint(id-9)){
                points.push(id-9)
            }
            //外圈
            if(point.rectId<2&&this.isEmptyPoint(id+9)){
                points.push(id+9)
            }
        }
        if(points.length>0){
            console.log(id,"还有出路",points.toString())
        }
        return points
    },
    isEmptyPoint(id){
        let point = this.getPoint(id)
        if(point.placeId==4)return false
        return !point.chess
    },
})

module.exports = GameLogic
