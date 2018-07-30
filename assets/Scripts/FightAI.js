let Player = require("Player")

cc.Class({
    extends: cc.Component,

    properties: {
        player:Player,
    },
    ctor(){
    	//所有的成三列表
    	this.threeList = []
    	//位置对应成三列表
    	this.pointThreeList = []

    	let base = [[0,1,2],[6,7,8],[0,3,6],[2,5,8]]
    	for (var i = 0; i < 3; i++) {
	    	for (var j = 0; j < base.length; j++) {
	    		let data = base[j]
	    		let three = [data[0]+9*i,data[1]+9*i,data[2]+9*i]
	    		this.threeList.push(three)
	    	}
    	}
    	this.threeList.push(1+9*0,1+9*1,1+9*2)
    	this.threeList.push(3+9*0,3+9*1,3+9*2)
    	this.threeList.push(5+9*0,5+9*1,5+9*2)
    	this.threeList.push(7+9*0,7+9*1,7+9*2)

    	for (var i = 0; i < this.threeList.length; i++) {
    		let three = this.threeList[i]
    		for (var j = 0; j < three.length; j++) {
    			let pointId = three[j]
    			this.pointThreeList[pointId] = this.pointThreeList[pointId] || []
    			this.pointThreeList[pointId].push(three)
    		}
    	}

    },
    AI(){
    	let point = this.getPointByNum(this.player,1)
    	if(point){
    		console.log("有已经成双的,下在",point.pointId)
    		return
    	}
    	point = this.get3(this.player)
    	if(point){
    		console.log("有已经成角的,下在",point.pointId)
    		return
    	}
    	point = this.getPointByNum(this.player,2)
    	if(point){
    		console.log("1个子，空行,下在",point.pointId)
    		return
    	}
    	point = this.getPointByNum(this.player,3)
    	if(point){
    		console.log("没有子，空行,下在",point.pointId)
    		return
    	}
    	point = this.getPoint_0()
		console.log("随便找个空位置,下在",point.pointId)
    },
    //是否被player占领
    isPlayerPoint(player,point){
		return point.chess&&!point.chess.isDie()&&player.isMe(point.chess.playerId)
    },
    //获取位置信息
    getListInfo(list){
    	let info = {empty:[]}
    	for(var i=0;i<list.length;i++){
    		let point = xx.gm.getPoint(list[i])
    		if(!point)continue
    		if(point.chess&&!point.chess.isDie()){
				info[point.chess.playerId] = info[point.chess.playerId] || []
				info[point.chess.playerId].push(point)
    		}else{
    			info.empty.push(point)
    		}
    	}
    	return info
    },
    // 获取已经成了X个的队列
    getEmptyInList(player,list,num){
    	let info = this.getListInfo(list)
    	let plist = info[player.playerId] || []
    	if(plist.length==list.length-num&&info.empty.length==num){
    		return info.empty[Math.floor((info.empty.length-1)/2)]
    	}
    	return null
    },
    getPointByNum(player,emptyNum){
    	let points = xx.gm.getPoints()
    	for (var i = 0; i < this.threeList.length; i++) {
    		let p = this.getEmptyInList(player,this.threeList[i],emptyNum)
    		if(p){
    			return p
    		}
    	}
    	return null
    },
    //成直角的
    get3(player){
    	let points = xx.gm.getPoints()
    	for(var i=0;i<points.length;i++){
    		let point = points[i]
    		if(this.isPlayerPoint(player,point))continue

    		let rowPoint = this.getPointByRow_1(point.pointId,player)
    		let columnPoint = this.getPointByColumn_1(point.pointId,player)
    		if(rowPoint&&rowPoint.pointId!=point.pointId&&columnPoint&&columnPoint.pointId!=pointId){
    			return rowPoint
    		}
    	}
    	return null
    },
    // 找个空位置
    getPoint_0(){
    	let points = xx.gm.getPoints()
    	for(var i=0;i<points.length;i++){
    		let point = points[i]
    		if(!point.chess||point.chess.isDie())return point
    	}
    	return null
    },
    // 获取X所在行的首个空点位置，如果有其他玩家的子，则返回空
    getPointByRow_1(pointId,player){
    	if(pointId%9==4)return 0
    	let point = xx.gm.getPoint(pointId)
    	let spId = point.rectId*9+point.rowId*3
		let list = [spId,spId+1,spId+2]
    	// 外圈
    	if(point.rowId==1){
    		list = [point.placeId,point.placeId+9,point.placeId+9*2]
    	}
		let info = this.getListInfo(list)
    	let plist = info[player.playerId] || []
		//空两个，有一个
		if(plist.length==1&&info.empty.length==2){
			return info.empty[0]
		}
		return null
    },
    // 获取X所在列的首个空点位置，如果有其他玩家的子，则返回空
    getPointByColumn_1(pointId,player){
    	if(pointId%9==4)return 0
    	let point = xx.gm.getPoint(pointId)
    	let spId = point.rectId*9+point.columnId
		let list = [spId,spId+3,spId+3*2]
    	// 外圈
    	if(point.columnId==1){
    		list = [point.placeId,point.placeId+9,point.placeId+9*2]
    	}
		let info = this.getListInfo(list)
    	let plist = info[player.playerId] || []
		//空两个，有一个
		if(plist.length==1&&info.empty.length==2){
			return info.empty[0]
		}
		return null
    },


    AIMOVE(){
    	let player = this.player
    	let nextStep = null
    	let maxScore = 1
    	for (var i = 0; i < player.chessList.length; i++) {
    		let chess = player.chessList[i]
    		if(chess.isDie())continue;
    		let info = this.moveScore(chess)
    		if(info.score>maxScore){
    			maxScore = info.score
    			nextStep = info
    		}
    	}
    	if(nextStep){
    		console.log("下一步",nextStep.chess.pointId,"--->",nextStep.point.pointId)
    	}else{
    		console.log("AI傻逼了，也不知道怎么移动")
    	}
    },
    moveScore(point){
    	let upPoint = xx.gm.getPointByKey(cc.p(point.x,point.y+1))
    	let downPoint = xx.gm.getPointByKey(cc.p(point.x,point.y-1))
    	let leftPoint = xx.gm.getPointByKey(cc.p(point.x-1,point.y))
    	let rightPoint = xx.gm.getPointByKey(cc.p(point.x+1,point.y))
    },
});
