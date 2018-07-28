/**
 * 微信小游戏，界面对接
 **/
let wxBridge = cc.Class({
    ctor(){

    },
    // 发消息给子域
    postMessage(k,v){
    	if (!CC_WECHATGAME) {
            cc.log("获取横向展示排行榜数据。x1");
            return
        }
        window.wx.postMessage({
            type: k,
            data: v
        });
    },
});

module.exports = wxBridge