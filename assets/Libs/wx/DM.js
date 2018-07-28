/**
 * 
 **/
let DM = cc.Class({
    ctor(){
        this.userInfo = {
            nickName:"测试昵称",
            avatarUrl:"notes.png",
        }
    },
    // 登陆
    login(cb){
        if(cb)cb()
    },
    //用户信息
    getUserData(){
        return this.userInfo
    },
    share(title,img,params){
    },
    systemShare(title,img,params){
    },
})

module.exports = DM
