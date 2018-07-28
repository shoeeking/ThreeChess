
function EventManager(){
    this.node = new cc.EventTarget()
}
let proto = EventManager.prototype


proto.on = function (type, callback, target, useCapture) {
    this.node.on(type, callback, target,false)
};
proto.once = function (type, callback, target) {
    this.node.once(type, callback, target,false)
}
proto.off = function (type, target) {
	if(!target){
        cc.error("目标为空");
	}
    var listeners = this.node._bubblingListeners;
    if (listeners) {
        var list = listeners._callbackTable[type];
	    if (list) {
	        var callbacks = list.callbacks;
	        var targets = list.targets;
	        for (var i = 0; i < targets.length; ++i) {
	            if (targets[i] === target) {
	                if (list.isInvoking) {
	                    list.cancel(i);
	                }
	                else {
	                    cc.js.array.fastRemoveAt(callbacks, i);
	                    cc.js.array.fastRemoveAt(targets, i);
	                }
	                break;
	            }
	        }
	    }

        if (target && target.__eventTargets) {
            cc.js.array.fastRemove(target.__eventTargets, this);
        }
        this.node._purgeEventFlag(type, listeners, false);
    }
}
proto.dispatch = function(type,data){
    this.node.emit(type,data)
},
//删除target上所有回调
proto.targetOff = function (target) {
    this.node.targetOff(target)
}
// 删除所有target的type类型回调
proto.typeOff = function(type){
    this.node.off(type, null, null,false)
}
proto.cbOff =function(type,callback,target){
	if(!callback){
        cc.error("回调为空");
	}
    this.node.off(type, callback, target,false)
}


module.exports = EventManager