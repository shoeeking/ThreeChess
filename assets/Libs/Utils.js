// 通用方法

let Utils={}
// 获取场景画布
Utils.getCanvas = function(){
    let scane = cc.director.getScene()
    let canvas = this.scene.getChildByName("Canvas")
    return canvas
}

Utils.handler = function(cb,tag,...args){
	return function(...args0){
		cb.apply(tag,args0.concat(args))
	}
}
// 获取窗口大小
Utils.WinSize = function(){
	return cc.view.getFrameSize()
}
// 加载远程头像
Utils.loadImage = function(sprite,url){
    cc.loader.load(
    	url,
    	(err, texture) => {
    		if(texture){
        		sprite.spriteFrame = new cc.SpriteFrame(texture);
    		}else{
    			console.log("can't load img : "+url)
    		}
    })
}
//加载微信头像
Utils.loadWXImage = function(sprite,avatarUrl){
	if (CC_WECHATGAME) {
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    sprite.node.active = false;
                }
            };
            image.src = avatarUrl;
        }catch (e) {
            cc.log(e);
            sprite.node.active = false;
        }
    } else {
        this.loadImage(sprite,avatarUrl)
    }
}

module.exports = Utils