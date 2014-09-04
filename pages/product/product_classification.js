/**
 * Created by hugly on 14-7-10.
 */
$(document).ready(function(){
    product_classification.init();
});
product_classification={
    //修改还是增加
    isAdd:true,
    //增加修改模板
    oTemzoom:null,
    //商品分类id
    classId:null,
    //初始化函数
    init:function(){
        this.bindEvent();
        this.getData();
    },
    //获取数据
    getData:function(){
        var _this=this;
        top.AJAX.getProductTypeList({
            callback:function(rs){
                _this.bindData(rs);
            }
        });
    },
    //绑定数据
    bindData:function(data){
        var oParent=$("#product_classification_title");
        var oTem=$("#product_classification_template");
        for(var i= 0,l=data.length;i<l;i++){
            this.createDom(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDom:function(data,oParent,oTem){
        var oTar=oTem.clone(true);
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);
    },
    //填充数据
    fillData:function(obj,data){
        var isshow=data.IsShow?"显示":"不显示";
        obj.find(".product_classification_name span").text(data.Name);
        obj.find(".product_classification_sort input").val(data.DisplaySequence);
        obj.find(".product_classification_dis a").text(isshow);
        obj.attr({"CategoryId":data.CategoryId});
        obj.attr({"dis":data.IsShow});
    },
    //事件绑定函数
    bindEvent:function(){
        var _this=this,
            oAdd=$("#add_product_classification"),
            oEdit=$(".product_classification_detail_edit"),
            oDel=$(".product_classification_detail_del"),
            oZoom=$("#add_product_classification_con"),
            oZoomCon=$("#add_product_classification_list"),
            oDelZoom=$("#add_product_classification_del"),
            oSure=$(".add_product_classification_list_add"),
            oSurego=$(".add_product_classification_list_addcon"),
            oDis=$(".product_classification_dis a"),
            oSort=$(".product_classification_sort input");
        //编辑
        oEdit.click(function(){
            _this.editProduct(this,oZoom,oZoomCon);
        });
        //删除
        oDel.click(function(){
            _this.delProduct(this);
        });
        //新增
        oAdd.click(function(){
            _this.addProduct(this,oZoom,oZoomCon);
        });
        //关闭弹出层
        oDelZoom.click(function(){
            _this.delZoom(this);
        });
        //编辑完成后确定修改
        oSure.click(function(){
             _this.editOk(this);
        });
        //保存后继续添加
        oSurego.click(function(){
             _this.editOkGo(this);
        });
        //是否显示操作
        oDis.click(function(){
           _this.isDis(this);
        });
        //商品分类排序
        oSort.blur(function(){
           _this.sortType(this);
        });
    },
    //判断是否符合规则
    isStandard:function(obj){
        var nameReg=/^(.{1,60})$/g,
            nameVal=obj.find(".add_articalCategory_name").val();
        if(!nameReg.test(nameVal)){
            alert("分类名称输入不符合规范!");
            return false;
        }else{
            return true;
        }
    },
    //编辑事件
    editProduct:function(obj,oZoom,oZoomCon){
        oZoom.css({"display":"block"});
        this.isAdd=false;
        this.oTemzoom=oZoomCon.clone(true);
        this.oTemzoom.removeAttr("style");
        this.oTemzoom.removeAttr("id");
        this.oTemzoom.find(".add_product_classification_list_addcon").remove();
        this.editDataBind(this.oTemzoom,obj);
        this.classId=$(obj).parent().parent().attr("CategoryId");
        //插入到相应位置
        this.oTemzoom.insertAfter(oZoom);
    },
    //编辑事件绑定数据
    editDataBind:function(oTemzoom,obj){
        oTemzoom.find(".add_articalCategory_name").val($(obj).parent().parent().find(".product_classification_name span").text());
    },
    //编辑完成后确定修改
    editOk:function(obj){
        var _this=this,
            val=$(obj).parent().prev().find("input").val(),
            isStandard=this.isStandard($(obj).parent().parent());
        if(isStandard) {
            if (!this.isAdd) {
                //修改商品分类
                top.AJAX.editProductType({
                    data: {
                        Name: val,                 //添加名       @param:str   0-60字符
                        CategoryId: _this.classId                //分类id       @param:int
                    },
                    callback: function (rs) {
                        alert("修改商品分类成功！");
                        window.location.reload();
                    }
                });
            } else {
                //新增商品分类
                top.AJAX.addProductType({
                    data: {
                        Name: val                 //添加名       @param:str  0-60字符
                    },
                    callback: function (rs) {
                        $(obj).parent().prev().find("input").val("");
                        alert("添加商品分类成功！");
                        window.location.reload();
                    }
                });
            }
        }
    },
    //保存后继续添加
    editOkGo:function(obj){
        var val=$(obj).parent().prev().find("input").val();
        //新增商品分类
        top.AJAX.addProductType({
            data:{
                Name:$(obj).parent().prev().find("input").val()                 //添加名       @param:str  0-60字符
            },
            callback:function(rs){
                $(obj).parent().prev().find("input").val("");
                alert("添加商品分类成功！");
            }
        });
    },
    //删除事件
    delProduct:function(obj){
        //删除商品分类
        if(confirm("确定删除？")){
            top.AJAX.delProductType({
                data:{
                    CategoryId:$(obj).parent().parent().attr("CategoryId")                //分类id       @param:int
                },
                callback:function(rs){
                        $(obj).parent().parent().remove();
                }
            });
        }
    },
    //新增事件
    addProduct:function(obj,oZoom,oZoomCon){
        oZoom.css({"display":"block"});
        this.oTemzoom=oZoomCon.clone(true);
        this.isAdd=true;
        this.oTemzoom.removeAttr("style");
        this.oTemzoom.removeAttr("id");
        //插入到相应位置
        this.oTemzoom.insertAfter(oZoom);
    },
    //删除增加修改弹出层
    delZoom:function(obj){
        $(obj).parent().prev().css({"display":"none"});
        $(obj).parent().remove();
        window.location.reload();
    },
    //是否显示操作
    isDis:function(obj){
        var _this=this,
            dis=$(obj).parent().parent().attr("dis");
        if(dis=="false"){
            dis=true;
        }else if(dis==true){
            dis=false;
        }else if(dis="true"){
            dis=false;
        }else if(dis=false){
            dis=true;
        }
        //是否显示商品分类
        top.AJAX.isUseProductType({
            data:{
                CategoryId:$(obj).parent().parent().attr("categoryid"),                //分类id       @param:int
                isshow:dis                    //是否显示      @param:Boolean    true:显示, false:不显示
            },
            callback:function(rs){
                var show=dis?"显示":"不显示";
                $(obj).text(show);
                dis=$(obj).parent().parent().attr({"dis":dis});
            }
        });
    },
    //分类排序
    sortType:function(obj){
        //商品分类排序
        top.AJAX.sortProductType({
            data:{
                list:[
                    {
                        ID:$(obj).parent().parent().attr("categoryid"),                      //param:int   分类id
                        DisplaySequeceNum:$(obj).val()        //param:int   排序值
                    }
                ]
            },
            callback:function(rs){
                alert("排序成功！");
                window.location.reload();
            }
        });
    }
};

































