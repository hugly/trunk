/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-7-14
 * Time: 下午3:51
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    panic_index.init();
});
panic_index={
    init:function(){
        this.bingEvent();
    },
    bingData:function(){},
    bingEvent:function(){
        var _this=this,
            oAdd=$("#add_panic_index");
        oAdd.click(function(){
            _this.addcommodity();
        });
    },
    //添加新商品函数
    addcommodity:function(){
        top.O2O.openNewWindow({
            title:"添加",        //@param,  str
            url:"pages/panic/panic_add.html",          //@param,  str
            width:800,        //@param,  int
            height:600        //@param,  int
        })
    }

};