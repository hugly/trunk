/**
 * Created by hugly on 14-7-9.
 */
//获取商品品牌列表
$(document).ready(function(){
    product_levellist.init();
});
product_levellist={
    //编辑或者修改
    isAdd:true,
    //现有的图片
    nowImage:[],
    oTemzoom:null,
    //数据
    data:null,
    //当前id值
    levelListId:0,
    //初始化函数
    init:function(){
        this.loadData();
        this.bindEvent();
    },
    //上传图片
    upLoadImg:function(arr){
        var _this=this;
        window.abc = new $.uploadFile({
            id:"add_product_levellist_icon",                  //input[type='file']的 id   @param:str
            formId:"add_product_levellist_form",              //表单id                     @param:str
            types:"jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber:1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc:top.AJAX.fileUploadUrl,
            showImageWrapId:"add_product_levellist_div",      //图片上传完后显示区域id        @param:str
            imgs:arr                     //已存在的图片                 @param:array
        });
    },
    //数据加载
    loadData:function(){
        var _this=this;
        top.AJAX.getProductLevelList({
            callback:function(rs){
                _this.data=rs;
                _this.bindDate(rs);
            }
        });
    },
    //绑定数据
    bindDate:function(data){
        var oParent=$("#product_levellist_title");
        var oTem=$("#product_levellist_template");
        for(var i=0;i<data.length;i++){
            this.createDetail(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDetail:function(data,oParent,oTem){
        //克隆当前数据
        var oTar=oTem.clone(true);
        //oTar.css({"display":"block"});
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);

    },
    //数据内容填充
    fillData:function(obj,data){
        var isshow=data.IsShow?"显示":"不显示";
        obj.find(".product_levellist_logo_img").attr({"src":data.upload.UploadPath});
        obj.find(".product_levellist_name span").text(data.LevelName);
        obj.find(".product_levellist_sort span").text(data.ProLevel);
        obj.find(".product_levellist_dis a").text(isshow);
        obj.attr({"product_id":data.ProductLevelID});
        obj.attr({"dis":data.IsShow});
    },
    //事件绑定
    bindEvent:function() {
        var _this=this,
        //添加
            oAppend=$(".add_product_levellist"),
        //编辑
            oEdit=$(".product_levellist_detail_edit"),
        //删除
            oDel=$(".product_levellist_detail_del"),
        //查询
            oSearch=$(".search_product_levellist_search a"),
        //批量保存排序
            oSort=$(".search_product_levellist_sort a"),
        //关闭弹出窗口
            oClose=$("#add_product_levellist_del"),
        //确定增加按钮
            oSure=$(".add_product_levellist_list_add"),
        //遮罩层
            zoom=$("#add_product_levellist_con"),
        //内容层
            oLayer=$("#add_product_levellist_list"),
        //确定添加或者编辑事件
            oSure=$(".add_product_levellist_list_add"),
        //是否显示
            oDis=$(".product_levellist_dis a");

        //编辑事件
        oEdit.click(function(){
            _this.editDetil(this,zoom,oLayer);
            _this.upLoadImg(_this.nowImage);
        });
        //删除事件
        oDel.click(function(){
            _this.delDetil(this);
        });
        //添加事件
        oAppend.click(function(){
            _this.addDetil(zoom,oLayer);
            _this.upLoadImg([]);
        });
        //关闭弹出窗口事件
        oClose.click(function(){
            _this.closeZoom(zoom,this);
        });
        //确定增加事件
        oSure.click(function(){
           _this.savaDetail(this);
        });
        //是否显示操作
        oDis.click(function(){
            _this.isDisfun(this);
        });
    },
    //克隆弹出层
    cloneDemo:function(zoom,oLayer){
        zoom.css({"display":"block"});
        this.oTemzoom=oLayer.clone(true);
        this.oTemzoom.removeAttr("style");
        this.oTemzoom.removeAttr("id");
        //插入到相应位置
        this.oTemzoom.insertAfter(zoom);
    },
    //编辑事件
    editDetil:function(obj,zoom,oLayer){
        this.cloneDemo(zoom,oLayer);
        this.isAdd=false;
        var img_src=$(obj).parent().parent().find(".product_levellist_logo_img").attr("src");
        if(img_src!=undefined){
            this.nowImage.push(img_src);
        }
        var nowId=$(obj).parent().parent().attr("product_id");
        for(var i= 0,l=this.data.length;i<l;i++){
            if(nowId==this.data[i].ProductLevelID){
                this.oTemzoom.find(".add_articalCategory_name").val(this.data[i].LevelName);
                this.oTemzoom.find(".add_articalCategory_sort").val(this.data[i].ProLevel);
                this.oTemzoom.find(".add_product_levellist_intro").val(this.data[i].LevelDesc);
                this.levelListId=this.data[i].ProductLevelID;
            }
        }
    },
    //删除事件
    delDetil:function(obj){
        //商品等级删除
        if(confirm("确定要删除当前商品等级吗？")){
            top.AJAX.delProductLevel({
                data:{
                    productlevelid:$(obj).parent().parent().attr("product_id")      //等级id   @param:int
                },
                callback:function(rs){
                        $(obj).parent().parent().remove();
                    }
            });
        }
    },
    //添加事件
    addDetil:function(zoom,oLayer){
        this.nowImage=[];
        this.isAdd=true;
        this.cloneDemo(zoom,oLayer);
    },
    //关闭弹出窗口
    closeZoom:function(zoom,obj){
        zoom.css({"display":"none"});
        $(obj).parent().remove();
    },
    //验证数据是否符合规范
    isStandard:function(obj){
        var nameReg=/^(.{1,20})$/g,
            sortReg=/^(\d{1,2})$/g,
            levelName=obj.find(".add_articalCategory_name").val(),
            levelSort=obj.find(".add_articalCategory_sort").val();
        if(!nameReg.test(levelName)){
            alert("商品等级名称输入不符合规范!");
            return false;
        }else{
            if(!sortReg.test(levelSort)){
                alert("等级排序顺序输入不符合规范!");
                return false;
            }else{
                return true;
            }
        }
    },
    //编辑保存或者添加保存事件
    savaDetail:function(obj){
        var val=$(obj).parent().parent().find(".add_articalCategory_name").val(),
            _this=this,
            parent=$(obj).parent().parent(),
            isStand=this.isStandard(parent);
        if(isStand) {
            if (!this.isAdd && isStand) {
                //商品等级修改
                top.AJAX.editProductLevel({
                    data: {
                        ProductLevelID: _this.levelListId,      //等级id   @param:int
                        LevelName: parent.find(".add_articalCategory_name").val(),           //等级名称  @param:str   0-200字符
                        ProLevel: parent.find(".add_articalCategory_sort").val(),            //商品等级  @param:int
                        LevelDesc: parent.find(".add_product_levellist_intro").val(),           //等级说明  @param:str
                        upload: {
                            UploadPath: parent.find("#add_product_levellist_div img").attr("src"),      //上传的图片地址(上传时返回的地址)   @param:Str
                            UploadPageUrl: window.location.pathname    //当前页面地址全路径不需要域 @param:Str
                        }
                    },
                    callback: function (rs) {
                        alert("商品等级修改成功！");
                        window.location.reload();
                    }
                });
            } else {
                //商品等级添加
                top.AJAX.addProductLevel({
                    data: {
                        LevelName: parent.find(".add_articalCategory_name").val(),           //等级名称  @param:str   0-200字符
                        ProLevel: parent.find(".add_articalCategory_sort").val(),            //商品等级  @param:int
                        LevelDesc: parent.find(".add_product_levellist_intro").val(),           //等级说明  @param:str
                        upload: {
                            UploadPath: parent.find("#add_product_levellist_div img").attr("src"),      //上传的图片地址
                            UploadPageUrl: window.location.pathname    //当前页面地址全路径不需要域
                        }
                    },
                    callback: function (rs) {
                        alert("商品等级添加成功！");
                        window.location.reload();
                    }
                });
            }
        }
    },
    //是否显示
    isDisfun:function(obj){
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
        //是否显示商品等级
        top.AJAX.isUseProductLevel({
            data:{
                productlevelid:$(obj).parent().parent().attr("product_id"),       //商品等级id  @param:int
                isshow:dis                 //是否显示   @param:boolean   true:显示  false:不显示
            },
            callback:function(rs) {
                var show=dis?"显示":"不显示";
                $(obj).text(show);
                dis=$(obj).parent().parent().attr({"dis":dis})
            }
        });
    }
};