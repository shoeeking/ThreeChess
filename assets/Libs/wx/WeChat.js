/**
 * 微信小游戏登陆渠道
 * 
 **/

let WeChat = cc.Class({
    ctor(){
        // 显示系统转发选项
        wx.showShareMenu()
    },
    //
    /**
     * 授权
     * scope.userInfo  wx.getUserInfo()    用户信息
     * scope.userLocation  wx.getLocation()    地理位置
     * scope.werun wx.getWeRunData()   微信运动步数
     * scope.record    wx.startRecord()、RecorderManager.start()    录音功能
     * scope.writePhotosAlbum  wx.saveImageToPhotosAlbum() 保存到相册
    */
    authorize(){
        let self = this
        wx.authorize({
            scope:"scope.userInfo",
            success:function(){
                
            },
            fail:function(){
                console.log("微信获取授权失败")
            }
        })
    },
    // 登陆
    login(cb){
        let self = this
        wx.login({
            success: function (res) {
                //用户登录凭证（有效期五分钟）
                let code = res.code
                self.getUserInfo(cb)
            },
            fail:function(){
                console.log("微信登陆失败")
            }
        })
    },
    //用户信息
    getUserInfo(cb){
        let self = this
        wx.getUserInfo({
            withCredentials:true,
            success:function(res){
                self.userInfo = res.userInfo
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
                if(cb){
                    cb(res.userInfo)
                }
            },
            fail:function(){
                console.log("微信获取用户信息失败")
            }
        })
    },
    getUserData(){
        return this.userInfo
    },
    share(){
        wx.shareAppMessage({
            title:"我是主动转发标题",
            imageUrl:"res/raw-assets/Texture/notes.png",//转发配图
            query:"type=1&vaule=我是主动转发参数"//转发参数
        })
    },
    systemShare(){
        // 设置转发参数
        wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
                title: '系统转发标题',
                imageUrl:"res/raw-assets/Texture/notes.png",//转发配图
                query:"type=1&vaule=我是系统转发参数"//转发参数
            }
        })
    },
})

module.exports = WeChat
