/**
 * Created by hugly on 14-7-11.
 * email:64617842@qq.com
 */

$(document).ready(function(){
    product_addcommodity.init();
});
product_addcommodity={
    //商品类别
    ProductType:0,
    //商品编码的前两位
    proNum:0,
    //存储图片的数组
    imageArr:[],
    //记录标签的id
    tagId:[],
    //过期时间或者过期天数
    expireData:0,
    //商品id
    ProductId:0,
    //修改还是添加数据   默认是添加商品数据
    operType:"add",
    //富文本编辑器中的数据
    edtior:null,
    //过期时间
    outData:null,
    //过期天数
    outDays:null,
    //初始化
    init:function(){
        this.operType=(window.location.href.indexOf("ProductId")!=-1)?"mdf":"add";
        this.bindEvent();
        this.createEditor();
        $("#product_addcommodity_setData").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "0Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
    },
    //编辑数据初始化
    editInit:function(){
        if(this.operType=="mdf"){
            this.ProductId=window.location.href.substring(window.location.href.indexOf("=")+1);
            this.getEditData();
        }else{
            this.uploadImg([]);
        }
    },
    //获取当前被编辑商品的详细信息
    getEditData:function(){
        var _this=this;
        //获取商品详细信息
        top.AJAX.getProductInfo({
            data:{
                productId:_this.ProductId       //商品id  @param:int
            },
            callback:function(rs){
                _this.bindEditData(rs);
                _this.uploadImg(_this.imageArr);
            }
        });
    },
    //绑定当前被编辑商品的详细信息
    bindEditData:function(data){
        var obj=$("#product_addcommodity");
        obj.find("#product_addcommodity_infro_name").val(data.ProductName);
        obj.find("#product_addcommodity_infro_code").val(data.ProductNewCode.substr(2));
        obj.find("#product_addcommodity_infro_price").val(data.MarketPrice);
        obj.find("#product_addcommodity_goods_intro").val(data.ShortDescription);
        obj.find("#product_addcommodity_infro_sort").val(data.DisplaySequence);
        obj.find("#product_addcommodity_search_title").val(data.Title);
        obj.find("#product_addcommodity_search_desc").val(data.Meta_Description);
        obj.find("#product_addcommodity_search_key").val(data.Meta_Keywords);
        this.editor.html(data.Description);
        //商品类别
        $("#product_addcommodity_infro_type").find("option").each(function(){
            if($(this).attr("value")==data.CategoryId){
                $(this).attr({"selected":"true"});
            }
        });
        //商品等级
        $("#product_addcommodity_extend").find("option").each(function(){
            if($(this).attr("value")==data.ProductLevelRelation.ProductLevelID){
                $(this).attr({"selected":"true"});
            }
        });

        var CouponType=data.ProductRelatedCoupon || {};
        //优惠券过期类别
        if(CouponType){
            if(CouponType.CouponOutType==0){
                obj.find(".product_addcommodity_info_setData input[type=radio]").each(function(){
                    $(this).removeAttr("checked");
                });
                obj.find(".product_addcommodity_info_setData input[type=radio]").eq(0).attr({"checked":"checked"});
                obj.find(".product_addcommodity_setData").css({"display":"block"});
                obj.find(".product_addcommodity_setday").css({"display":"none"});
                obj.find("#product_addcommodity_setData").val($.stamp2date(data.ProductRelatedCoupon.SetCouponOutDate));
            }else if(CouponType.CouponOutType==1){
                obj.find(".product_addcommodity_info_setData input[type=radio]").each(function(){
                    $(this).removeAttr("checked");
                });
                obj.find(".product_addcommodity_info_setData input[type=radio]").eq(1).attr({"checked":"checked"});
                obj.find(".product_addcommodity_setData").css({"display":"none"});
                obj.find(".product_addcommodity_setday").css({"display":"block"});
                obj.find("#product_addcommodity_setDay").val(data.ProductRelatedCoupon.SetCouponOutDays);
            }
        }

        var tagId=[];
        for(var i= 0,l=data.ProductTagList.length;i<l;i++){
            tagId.push(data.ProductTagList[i].TagId);
        }
        tagId=this.arrRidd(tagId);
        //商品标签
        $("#product_addcommodity_set_lable_container_ul").find("input").each(function(){
            for(var i=0;i<tagId.length;i++){
                if($(this).attr("value")==tagId[i]){
                    $(this).attr({"checked":"true"});
                }
            }
        });
        obj.find(".product_addcommodity_infro_category input").each(function(){
            $(this).removeAttr("checked");
        });
        //商品类型
        if(data.ProductType==0){

            this.ProductType=0;
            $(".product_addcommodity_infro_category").find("input").eq(0).attr({"checked":"true"});
        }else{
            this.ProductType=1;
            $(".product_addcommodity_infro_category").find("input").eq(1).attr({"checked":"true"});
            $("#product_addcommodity_coupons").css({"display":"block"});

        }

        //现有的图片
        if(data.UploadList!=null){
            for(var i=0;i<data.UploadList.length;i++){
                if(data.UploadList[i].UploadPath!=""){
                    this.imageArr.push(data.UploadList[i].UploadPath);
                }
            }
        }
    },
    //数组去重
    arrRidd:function(arr){
        var result=[];
        for(var i=0;i<arr.length;i++){
            if(result.length==0){
                result.push(arr[i]);
            }else{
                for(var j=0;j<result.length;j++){
                    if(result[j]!=arr[i]){
                        result.push(arr[i]);
                    }
                }
            }
//            if(result.indexOf(arr[i])==-1){
//                result.push(arr[i]);
//            }
        }
        return result;
    },
    //判断数字是否为两位数  不够补0
    isDou:function(n){
        return n>=10?n:"0"+n;
    },
    //生成富文本编辑器
    createEditor:function(){
        //var editor;
        var _this=this;
        KindEditor.ready(function(K) {
            _this.editor = K.create('textarea[name="content"]', {
                height:"300px",
                items:[ 'source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                    'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                    'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                    'anchor', 'link', 'unlink']
            });

            $(".product_addcommodity_goods_desc").find(".ke-container").attr({"style":""});
            //editor.html('<h3>asdfasdf</h3>');   //初始赋值
            _this.getTypeList();
        });
    },
    //生成上传图片控件
    uploadImg:function(arr){
        var _this=this;
        window.abc = new $.uploadFile({
            id:"product_addcommodity_pic_goods_form_input",                  //input[type='file']的 id   @param:str
            formId:"product_addcommodity_pic_goods_form",              //表单id                     @param:str
            types:"jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber:5,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc:top.AJAX.fileUploadUrl,
            showImageWrapId:"product_addcommodity_pic_goods_list",      //图片上传完后显示区域id        @param:str
            imgs:arr                     //已存在的图片                 @param:array
        });
    },
    //获取分类列表
    getTypeList:function(){
        var _this=this;
        top.AJAX.getProductTypeList({
            callback:function(rs){
                _this.typeList=rs;
                _this.bindTypeListData(rs);
                _this.getLevelList();
            }
        });
    },
    //获取商品等级列表
    getLevelList:function(){
        var _this=this;
        top.AJAX.getProductLevelList({
            callback:function(rs){
                _this.levelList=rs;
                _this.bindLevelListData(rs);
                _this.getProLableList();
            }
        });
    },
    //获取商品标签列表
    getProLableList:function(){
        var _this=this;
        //获取商品标签
        top.AJAX.getProductTagList({
            data:{
                TagID:"",       //标签id  @param:int
                TagName:""     //标签名  @param:str
            },
            callback:function(rs){
                _this.bindLableList(rs);
                _this.editInit();
            }
        });
    },
    //绑定商品标签数据
    bindLableList:function(data){
        var oParent=$("#product_addcommodity .product_addcommodity_set_lable_container_ul");
        for(var i= 0,l=data.length;i<l;i++){
            $('<li><input type="checkbox" value='+data[i].TagID+'><label>'+data[i].TagName+'</label></li>').appendTo(oParent);
        }
    },
    //绑定商品分类数据
    bindTypeListData:function(data){
        var oParent=$("#product_addcommodity_infro_type");
        for(var i= 0,l=data.length;i<l;i++){
            $("<option value="+data[i].CategoryId+">"+data[i].Name+"</option>").appendTo(oParent);
        }
    },
    //绑定商品等级数据
    bindLevelListData:function(data){
        var oParent=$("#product_addcommodity_extend");
        for(var i= 0,l=data.length;i<l;i++){
            $("<option value="+data[i].ProductLevelID+">"+data[i].LevelName+"</option>").appendTo(oParent);
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oParent=$("#product_addcommodity"),
            oCoupons=$("#product_addcommodity_coupons"),
            oChooseProductType=oParent.find(".product_addcommodity_infro_category input"),
            oChooseCouponType=oParent.find(".product_addcommodity_info_setData input"),
            oAddLable=oParent.find(".product_addcommodity_set_lable a"),
            oClose=$("#add_product_addcommodity_label_del"),
            oSuerAdd=$("#add_product_addcommodity_labellist .add_product_addcommodity_label_list_add"),
            oTar=$("#add_product_addcommodity_labellist"),
            zoom=$("#add_product_addcommodity_con"),
            oSav=oParent.find(".product_addcommodity_save a"),
            oCheck=oParent.find(".product_addcommodity_set_lable_container_ul input");
        //普通商品与优惠券
        oChooseProductType.click(function(){
            _this.choosePro(this,oChooseProductType,oCoupons);
        });
        //优惠券过期类别
        oChooseCouponType.click(function(){
            _this.chooseCoupon(this,oCoupons);
        });
        //添加商品标签
        oAddLable.click(function(){
            _this.addLable(oTar,zoom);
        });
        //关闭增加商品弹出层
        oClose.click(function(){
            _this.closeZoom(oTar,zoom,this);
        });
        //确定添加当前标签
        oSuerAdd.click(function(){
            _this.addLableDom(this);
        });
        //保存按钮
        oSav.click(function(){
            _this.savaData(oParent);
        });
    },
    //标签选中事件
    checkBoxChe:function(){
        var oZoom=$(".product_addcommodity_set_lable_container_ul input");
        for(var i= 0,l=oZoom.length;i<l;i++){
            if(oZoom[i].checked){
                var a={};
                a.TagId=oZoom[i].value;
                this.tagId.push(a);

            }
        }
    },
    //普通商品选择
    choosePro:function(obj,oSrc,oTar){
        $(obj).parent().find("input").removeAttr("checked");
        $(obj).attr({"checked":"true"});
        if(oSrc.eq(0).attr("checked")){
            this.ProductType=0;
            oTar.css({"display":"none"});
            $("#product_addcommodity_setData").val("");
            $("#product_addcommodity_setDay").val("");
        }else{
            this.ProductType=1;
            oTar.css({"display":"block"});
        }
    },
    //优惠券过期类别
    chooseCoupon:function(obj,oSrc){
        var _this=this;
        $(obj).parent().find("input").removeAttr("checked");
        $(obj).attr({"checked":"true"});
        if($(obj).parent().find("input").eq(0).attr("checked")){
            this.expireData=0;
            oSrc.find(".product_addcommodity_setData").css({"display":"block"});
            oSrc.find(".product_addcommodity_setData").next().css({"display":"none"});
            $("#product_addcommodity_setDay").val("");
        }else{
            this.expireData=1;
            oSrc.find(".product_addcommodity_setData").css({"display":"none"});
            oSrc.find(".product_addcommodity_setData").next().css({"display":"block"});
            $("#product_addcommodity_setData").val("");
        }
    },
    //添加商品标签
    addLable:function(oTar,zoom){
        //oTar.css({"display":"block"});
        var oTem=oTar.clone(true).attr({"id":""}).css({"display":"block"}),
            oTarget=$("#product_addcommodity");
//        oTem.removeAttr("id");
//        oTem.removeAttr("style");
        oTem.insertAfter(oTarget);
        zoom.css({"display":"block"});
    },
    //关闭添加标签弹出层
    closeZoom:function(oTar,zoom,obj){
        //oTar.css({"display":"none"});
        $(obj).parent().remove();
        zoom.css({"display":"none"});
    },
    //确定添加标签
    addLableDom:function(obj){
        var _this=this;
        //增加商品标签
        top.AJAX.addProductTag({
            data:{
                tagName:$("#add_product_addcommodity_label").val()       //标签名  @param:str
            },
            callback:function(rs){
                var oParent=$("#product_addcommodity .product_addcommodity_set_lable_container_ul");
                $('<li><input type="checkbox" value='+rs+'><label>'+$("#add_product_addcommodity_label").val()+'</label></li>').appendTo(oParent);
                alert("添加成功！");
                //window.location.reload();
                $(obj).parent().parent().remove();
                $("#add_product_addcommodity_con").css({"display":"none"});
            }
        });
    },
    //将传入的图片转化成对象
    image2Arr:function(){
        var oParent=$("#product_addcommodity_pic_goods_list"),
            imageArr2=[];
        oParent.find("img").each(function(){
            var a={};
            a.UploadPath=$(this).attr("src");
            a.UploadPageUrl=window.location.href;
            imageArr2.push(a);
        });
        return imageArr2;
    },
    //验证数据是否符合规范
    isStandard:function(obj){
        var nameReg=/^(.{1,60})$/g,
            sortReg=/^(\d+)$/g,
            codeReg=/^(\d{4})$/g,
            priceReg=/^\d+(\.\d+)?$/g;
        if(obj.find("#product_addcommodity_infro_type").val()=="<--请选择-->"){
            alert("所属分类必选!");
            return false;
        }

        if(obj.find(".product_addcommodity_infro_coupons").attr("checked")=="checked"){
            if(obj.find("#product_addcommodity_setData").val()=="" && obj.find("#product_addcommodity_setDay").val()==""){
                alert("优惠券过期时间或者过期天数必填!");
                return false;
            }
        }

        if(!nameReg.test(obj.find("#product_addcommodity_infro_name").val())){
            alert("商品名称不符合规则!");
            return false;
        }

        if(!sortReg.test(obj.find("#product_addcommodity_infro_sort").val())){
            alert("排序输入不符合规则!");
            return false;
        }

        if(obj.find("#product_addcommodity_infro_code").val()!=""){
            if(!codeReg.test(obj.find("#product_addcommodity_infro_code").val())){
                alert("商品编码输入不符合规则!");
                return false;
            }
        }

        if(!priceReg.test(obj.find("#product_addcommodity_infro_price").val())){
            alert("市场价输入不符合规则!");
            return false;
        }

        if(obj.find("#product_addcommodity_extend").val()=="<--请选择-->"){
            alert("商品级别必选!");
            return false;
        }else{
            return true;
        }


    },
    //保存添加或者修改
    savaData:function(oParent){
        this.checkBoxChe();
        var _this=this;
        this.proNum=$("#product_addcommodity_infro_type").val();
        var codeValue=$("#product_addcommodity_infro_code").val(),
            code="";
        if(codeValue!=""){
            code=this.isDou(this.proNum)+codeValue;
        }

        if(this.isStandard(oParent)){
            if(this.operType=="add"){
                //增加商品
                top.AJAX.addProduct({
                    data:{
                        CategoryId:$("#product_addcommodity_infro_type").val(),                      //@param:int   商品分类id
                        ProductName:$("#product_addcommodity_infro_name").val(),                     //@param:str   商品名称   0-60
                        ShortDescription:$("#product_addcommodity_goods_intro").val(),                //@param:str   商品简介   富文本里面的html
                        Description:_this.editor.html(),                     //@param:str    商品描述  富文本里面的html
                        Title:$("#product_addcommodity_search_title").val(),                           //@param:str    前台显示页面标题
                        Meta_Description:$("#product_addcommodity_search_desc").val(),                //@param:str    你懂的
                        Meta_Keywords:$("#product_addcommodity_search_key").val(),                   //@param:str    你懂的
                        DisplaySequence:$("#product_addcommodity_infro_sort").val(),                 //@param:int    排序 >0
                        MarketPrice:$("#product_addcommodity_infro_price").val(),                     //@param:float  市场价eg  12.00
                        ProductNewCode:code,                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
                        ProductLevelRelation:{
                            ProductLevelID:$("#product_addcommodity_extend").val()               //@param:int
                        },
                        ProductRelatedCoupon:{
                            CouponOutType:_this.expireData,               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
                            SetCouponOutDate: $.time2stamp($("#product_addcommodity_setData").val()),            //@param:int  过期时间(时间戳)
                            SetCouponOutDays:$("#product_addcommodity_setDay").val()             //@param:int  过期天数
                        },
                        ProductTagList:_this.tagId,
                        ProductType:_this.ProductType,
                        UploadList:this.image2Arr()
                    },
                    callback:function(rs){
                        alert("添加成功！");
                        top.O2O.refreshWindow("2");
                        top.O2O.closeWindow("proAdd");
                    }
                });
            }else{
                //修改商品
                top.AJAX.editProduct({
                    data:{
                        ProductId:_this.ProductId,                       //@param:int   商品id
                        CategoryId:$("#product_addcommodity_infro_type").val(),                      //@param:int   商品分类id
                        ProductName:$("#product_addcommodity_infro_name").val(),                     //@param:str   商品名称   0-60
                        ShortDescription:$("#product_addcommodity_goods_intro").val(),                //@param:str   商品简介   富文本里面的html
                        Description:_this.editor.html(),                     //@param:str    商品描述  富文本里面的html
                        Title:$("#product_addcommodity_search_title").val(),                           //@param:str    前台显示页面标题
                        Meta_Description:$("#product_addcommodity_search_desc").val(),                //@param:str    你懂的
                        Meta_Keywords:$("#product_addcommodity_search_key").val(),                   //@param:str    你懂的
                        DisplaySequence:$("#product_addcommodity_infro_sort").val(),                 //@param:int    排序 >0
                        MarketPrice:$("#product_addcommodity_infro_price").val(),                     //@param:float  市场价eg  12.00
                        ProductNewCode:code,                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
                        ProductLevelRelation:{
                            ProductLevelID:$("#product_addcommodity_extend").val()               //@param:int
                        },
                        ProductRelatedCoupon:{
                            CouponOutType:_this.expireData,               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
                            SetCouponOutDate: $.time2stamp($("#product_addcommodity_setData").val()),            //@param:int  过期时间(时间戳)
                            SetCouponOutDays:$("#product_addcommodity_setDay").val()             //@param:int  过期天数
                        },
                        ProductTagList:_this.tagId,
                        ProductType:_this.ProductType,
                        UploadList:this.image2Arr()
                    },
                    callback:function(rs){
                        alert("修改成功！");
                        top.O2O.refreshWindow("2");
                        top.O2O.closeWindow("proDetail");
                    }
                });
            }
        }
    }
};
