/**
 * Created by hugly on 14-7-11.
 */
$(document).ready(function(){
    product_contrast.init();
});
product_contrast={
    //已有图片的路径
    oldImgPath:null,
    //已有图片的id
    oldImgId:0,
    //已有的图片
    nowImg:[],
    //判是添加或者修改  false 代表修改  true 代表添加
    isAdd:false,
    //是否显示   true表示显示 false表示不显示
    isDis:false,
    //商家图片
    BusinessesIcon:null,
    //将数据进行缓存
    contrastData:null,
    //当前修改数据的id
    nowId:null,
    //搜索关键字
    rehref:"",
    //初始化函数
    init:function(){
        if(window.location.href.indexOf("=")!=-1){
            var href="";
            href=window.location.href.substring(window.location.href.indexOf("=")+1);
            this.rehref=decodeURI(href.substring(href.indexOf("=")+1));
        }
        this.initValue();
        this.getData();
        this.bindEvent();
    },
    //初始化搜索框的值
    initValue:function(){
        $("#search_product_query").prev().val(this.rehref);
    },
    //获取数据
    getData:function(){
        var _this=this;
        //获取比价商品信息列表
        top.AJAX.getCouponBusinessesList({
            data:{
                queryKey:_this.rehref     //@param:str   查询条件
            },
            callback:function(rs){
                _this.bindData(rs);
            }
        });
    },
    //上传图片
    upLoadImg:function(arr){
        var _this=this;
        window.abc = new $.uploadFile({
            id:"add_product_contrast_icon",                  //input[type='file']的 id   @param:str
            formId:"add_product_contrast_form",              //表单id                     @param:str
            types:"jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber:1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc:top.AJAX.fileUploadUrl,
            showImageWrapId:"add_product_contrast_layer",      //图片上传完后显示区域id        @param:str
            imgs:arr
                //[_this.nowImg]                     //已存在的图片                 @param:array
        });
    },
    //绑定数据
    bindData:function(data){
        this.contrastData=data;
        var oParent=$("#product_contrast_title");
        var oTem=$("#product_contrast_template");
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
        this.isDisplay=data.IsShow;
        var isshow=data.IsShow?"显示":"不显示";
        obj.find(".product_contrast_name span").text(data.BusinessesName);
        obj.find(".product_contrast_link span").text(data.BusinessesUrl);
        obj.find(".porduct_contrast_createtime span").text($.stamp2time(data.UpdateTime));
        obj.find(".product_contrast_display a").text(isshow);
        obj.find(".product_contrast_logo_img").attr({"src":data.upload.UploadPath});
        obj.attr({"BusinessesId":data.BusinessesId});
        obj.attr({"BusinessesIcon":data.BusinessesIcon});
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            obj=$(".product_contrast_detail"),
            //是否显示隐藏
            oDis=obj.find(".product_contrast_display a"),
            //编辑操作
            oEditor=obj.find(".product_contrast_detail_edit"),
            //删除操作
            oDel=obj.find(".product_contrast_detail_del"),
            //弹出层对象
            oLayer=$(".add_product_contrast_list"),
            //添加对比商家
            oAdd=$("#add_product_contrast"),
            //退出弹出层按钮
            oDelLayer=oLayer.find("#add_product_contrast_del"),
            //确定添加
            oSure=oLayer.find(".add_product_contrast_list_add"),
            //选择是否显示
            oChoose=oLayer.find(".add_product_contrast_isdis input"),
            //查询
            oSearch=$("#search_product_query");

        //编辑当前行
        oEditor.click(function(){
            _this.editorDetail(this);
            _this.upLoadImg(_this.nowImg);
        });
        //删除当前行
        oDel.click(function(){
            _this.deleDetail(this);
        });
        //添加对比商家
        oAdd.click(function(){
            _this.addDetail();
        });
        //退出弹出层
        oDelLayer.click(function(){
            _this.outLayer(this);
        });
        //确定添加或者修改
        oSure.click(function(){
            _this.sureDetail(this)
        });
        //选择是否显示
        oChoose.click(function(){
            _this.chooseDis(this);
        });
        //搜索
        oSearch.click(function(){
            _this.screenDetail(this);
        });
    },
    //搜索筛选列表
    screenDetail:function(obj){
        this.rehref=$(obj).prev().val();
        window.location.href="product_contrast.html?mainid=2&searchKey="+this.rehref;
    },
    //选择是否显示
    chooseDis:function(obj){
        $(obj).parent().find("input").removeAttr("checked");
        $(obj).attr({"checked":"true"});
    },
    //是否选中
    isDisEvent:function(){
        var aInput=$(".add_product_contrast_isdis input");
        if(aInput.eq(0).attr("checked")){
            this.isDis=true;
        }else{
            this.isDis=false;
        }
    },
    //clone弹出层
    cloneLayer:function(){
        var oTemplete=$("#add_product_contrast_list");
        var oT=oTemplete.clone(true);
        oT.removeAttr("id");
        oT.removeAttr("style");
        return oT;
    },
    //获取id当前列的数据
    getNowData:function(id){
        var data = null;
        for(var i=0;i<this.contrastData.length;i++){
            if(id==this.contrastData[i].BusinessesId){
                data = this.contrastData[i];
                break;
            }
        }
        return data;
    },
    //编辑当前行
    editorDetail:function(obj){
        this.isAdd=false;
        $("#add_product_contrast_con").css({"display":"block"});
        var oTem=this.cloneLayer(),
        nowData=this.getNowData($(obj).parent().parent().attr("businessesid"));
        this.nowId=$(obj).parent().parent().attr("businessesid");
        var img_src = $(obj).parent().parent().find(".product_contrast_logo_img").attr("src");
        if(img_src!=""){
            this.nowImg.push(img_src);
        }
        this.BusinessesIcon=$(obj).parent().parent().attr("BusinessesIcon");
        this.oldImgId=nowData.upload.UploadID;
        this.oldImgPath=nowData.upload.UploadOldPath;

        oTem.insertAfter("#add_product_contrast_con");
        oTem.find(".add_product_contrast_name").val(nowData.BusinessesName);
        oTem.find(".add_product_contrast_addressname").val(nowData.BusinessesUrl);
        if(nowData.IsShow){
           oTem.find(".dis").attr({"checked":"true"});
        }else{
           oTem.find(".redis").attr({"checked":"true"});
        }
    },
    //删除当前行
    deleDetail:function(obj){
        //删除商家比价

        if(confirm("确定删除当前商家？")){
            top.AJAX.delCouponBusinessesList({
                data:{
                    businessesId:$(obj).parent().parent().attr("businessesid")           //商家id      @param:int
                },
                callback:function(rs){
                        $(obj).parent().parent().remove();
                    }
            });
        }
    },
    //添加对比商家
    addDetail:function(){
        this.isAdd=true;
        $("#add_product_contrast_con").css({"display":"block"});
        var oTem=this.cloneLayer();
        oTem.find(".add_product_contrast_isdis input").eq(0).attr({"checked":"checked"});
        oTem.insertAfter("#add_product_contrast_con");
        this.upLoadImg([]);
    },
    //退出弹出层
    outLayer:function(obj){
        $("#add_product_contrast_con").css({"display":"none"});
        $(obj).parent().remove();
        this.nowImg=[];
    },
    //验证数据是否符合规范
    isStandard:function(obj){
        var nameReg=/^(.{1,10})$/g,
            webSiteReg=/^(http:\/\/).+$/,
            contrastName=obj.find(".add_product_contrast_name").val(),
            webSiteName=obj.find(".add_product_contrast_addressname").val();
        if(!nameReg.test(contrastName)){
            alert("商家名称输入不符合规范!");
            return false;
        }
        if(!(webSiteReg.test(webSiteName))){
            alert("商家官方地址输入不符合规范!必须以http://开头!");
            return false;
        }else{
            return true;
        }

    },
    //确定修改或者添加
    sureDetail:function(obj){
        this.isDisEvent();
        var oParent=$(obj).parent().parent(),
            _this=this,
            isStandard=this.isStandard(oParent);
        if(isStandard) {
            if (this.isAdd) {
                //添加比价商家
                top.AJAX.addCouponBusinessesList({
                    data: {
                        BusinessesName: oParent.find(".add_product_contrast_name").val(),          //商家名称     @param:str   0-10str
                        BusinessesUrl: oParent.find(".add_product_contrast_addressname").val(),           //商家官网     @param:str
                        IsShow: this.isDis,                   //是否显示     @param:boolean   true/false
                        upload: {
                            UploadPath: oParent.find("img").attr("src"),
                            UploadPageUrl: window.location.pathname
                        }
                    },
                    callback: function (rs) {
                        alert("添加比价商家成功！");
                        window.location.reload();
                        _this.nowImg=[];
                    }
                });
            } else {
                //修改商家比价
                top.AJAX.editCouponBusinessesList({
                    data: {
                        BusinessesId: this.nowId,            //商家id      @param:int
                        BusinessesName: oParent.find(".add_product_contrast_name").val(),          //商家名称     @param:str   0-10str
                        BusinessesIcon: _this.businessesId,          //商家图标     @param:int
                        BusinessesUrl: oParent.find(".add_product_contrast_addressname").val(),           //商家官网     @param:str
                        IsShow: this.isDis,                   //是否显示     @param:boolean   true/false
                        upload: {
                            UploadOldPath:_this.oldImgPath,
                            UploadID:_this.oldImgId,
                            UploadPath: oParent.find("img").attr("src"),
                            UploadPageUrl: window.location.pathname
                        }
                    },
                    callback: function (rs) {
                        alert("修改比价商品成功！");
                        window.location.reload();
                        _this.nowImg=[];
                    }
                });
            }
        }
    }
};


















