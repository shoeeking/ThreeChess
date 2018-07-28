let Utils = require("Utils")
let EventManager = require("EventManager")
let LayerManager = require("LayerManager")
// 定义全局变量
window.xx={
    size:cc.view.getVisibleSize(),
    event:new EventManager(),
    layer:new LayerManager(),
    utils:Utils
}
