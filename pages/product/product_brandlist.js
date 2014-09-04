/**
 * Created by hugly on 14-7-9.
 */
//获取商品品牌列表
$(document).ready(function(){
    product_brandlist.init();
});
product_brandlist={
    //初始化函数
    init:function(data){
        this.bindDate(data);
        this.bindEvent();
    },
    //获取数据
    getDate:function(){

    },
    //绑定数据
    bindDate:function(data){
        var oParent=$("#product_brandlist_title");
        var oTem=$("#product_brandlist_template");
        for(var i=0;i<data.length;i++){
            this.createDetail(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDetail:function(data,oParent,oTem){
        //克隆当前数据
        var oTar=oTem.clone(true);
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);

    },
    //数据内容填充
    fillData:function(obj,data){
        obj.find(".product_brandlist_logo_img").attr({"src":data.Logo});
        obj.find(".product_brandlist_name span").text(data.BrandName);
        obj.find(".product_brandlist_sort_index").attr({"value":data.DisplaySequence});
        obj.attr({"product_id":data.BrandId});
    },
    //事件绑定
    bindEvent:function() {
        var _this=this,
            //添加
            oAppend=$(".add_product_brandlist"),
            //编辑
            oEdit=$(".product_brandlist_detail_edit"),
            //删除
            oDel=$(".product_brandlist_detail_del"),
            //查询
            oSearch=$(".search_product_brandlist_search a"),
            //批量保存排序
            oSort=$(".search_product_brandlist_sort a"),
            //关闭弹出窗口
            oClose=$("#add_product_brandlist_del"),
            //确定增加按钮
            oSure=$(".add_product_brandlist_list_add"),
            //遮罩层
            zoom=$("#add_product_brandlist_con"),
            //内容层
            oLayer=$("#add_product_brandlist_list");

        //编辑事件
        oEdit.click(function(){
            _this.editDetil(this,zoom,oLayer);
        });
        //删除事件
        oDel.click(function(){
            _this.delDetil(this);
        });
        //添加事件
        oAppend.click(function(){
            _this.addDetil(zoom,oLayer);
        });
        //关闭弹出窗口事件
        oClose.click(function(){
            _this.closeZoom(zoom,oLayer);
        });
        //确定增加事件

    },
    //编辑事件
    editDetil:function(obj,zoom,oLayer){
        zoom.css({"display":"block"});
        oLayer.css({"display":"block"});
        oLayer.find(".add_articalCategory_name").attr({"value":$(obj).parent().prev().prev().text()});
    },
    //删除事件
    delDetil:function(obj){
        if(confirm("确定要删除数据吗？")){
            $(obj).parent().parent().remove();
        }
    },
    //添加事件
    addDetil:function(zoom,oLayer){
        zoom.css({"display":"block"});
        oLayer.css({"display":"block"});
        oLayer.find(".add_articalCategory_name").attr({"value":""});
    },
    //关闭弹出窗口
    closeZoom:function(zoom,oLayer){
        zoom.css({"display":"none"});
        oLayer.css({"display":"none"});
    }
};
