
cc.Class({
    extends: cc.Component,

    properties: {
        txt:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let ctx = this.node.getComponent(cc.Graphics)
        ctx.moveTo(0,0)
        ctx.circle(this.node.width/2,this.node.height/2,this.node.width/2)
        ctx.stroke()
    },
    init(pointId){
        this.pointId = pointId
        this.txt.string=pointId
    },
    onClick(cb,target){
        this.cb=xx.utils.handler(cb,target)
    },
    clickEvent(){
        if(this.cb){
            this.cb(this)
        }
    },

    // update (dt) {},
});
