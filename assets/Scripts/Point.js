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
    init(id){
        this.id = id
        this.txt.string=id
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
