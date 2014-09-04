/**
 * Created by hugly on 14-7-25.
 */
$(document).ready(function(){
    product_inforAboutProduct.init();
});
product_inforAboutProduct={
    isGo:true,
    //关键字
    keyword:"",
    //当前商品的id
    productId:0,
    //初始化
    init:function(){
        this.productId=window.location.href.substr(window.location.href.indexOf("=")+1);
        this.bindEvent();
        this.getProDetailData();
    },
    //获取商品详细信息
    getProDetailData:function(){
        var _this=this;
        //获取商品详细信息
        top.AJAX.getProductInfo({
            data:{
                productId:_this.productId       //商品id  @param:int
            },
            callback:function(rs){
                _this.bindProDetailData(rs);
                _this.getListForProduct();
            }
        });

    },
    //获取指定商品对应的资讯
    getListRelateData:function(data){
        if(this.isGo){
            var _this=this;
            //获取指定商品对应的资讯
            top.AJAX.getConsultation({
                data:{
                    productId:_this.productId       //商品id  @param:int
                },
                callback:function(rs){
                    _this.createArticalRightList(rs,data);
                }
            });
        }
    },
    //获取指定的资讯
    getListForProduct:function(){
        var _this=this;
        top.AJAX.getAppointConsultation({
            data:{
                categoryId:3,       // 资讯类别id @param:int
                queryKey:_this.keyword,         // 资讯标题模糊查询 @param:str
                topNumber:50         // 资讯获取数量 @param:int
            },
            callback:function(rs){
                _this.createArticalList(rs);
                _this.getListRelateData(rs);
            }
        });
    },
    //创建右侧列表
    createArticalRightList:function(data,titleData){
        for(var i= 0,l=data.length;i<l;i++){
            this.createArticalRightDom(data[i],titleData)
        }
    },
    //创建右侧列表的dom树
    createArticalRightDom:function(data,titleData){
        var oTem=$("#product_inforAboutProduct_content_right_template"),
            oTar=null,
            oParent=$("#product_inforAboutProduct_content_right_template_layer");

        oTar=oTem.clone(true);
        oTar.removeAttr("id");
        oTar.removeAttr("style");
        this.fillArticalData(oTar,data,titleData);
        oTar.appendTo(oParent);

    },
    //填充右侧列表数据
    fillArticalData:function(obj,data,titleData){
        var str="";
        for(var i= 0,l=titleData.length;i<l;i++){
            if(titleData[i].ArticleId==data.ArticleId){
                str=titleData[i].Title;
            }
        }
        obj.find(".product_right_inforName span").text(str);
        obj.attr({"ArticleId":data.ArticleId});
    },
    //绑定左侧数据列表
    createArticalList:function(data){
        for(var i= 0,l=data.length;i<l;i++){
            this.createArticalListDom(data[i]);
        }
    },
    //创建dom结构树
    createArticalListDom:function(data){
        var oTem=$("#product_inforAboutProduct_content_left_template"),
            oTar=null,
            oParent=$("#product_inforAboutProduct_content_left_template_layer");

        oTar=oTem.clone(true);
        oTar.removeAttr("id");
        oTar.removeAttr("style");
        this.bindAritcalData(oTar,data);
        oTar.appendTo(oParent);

    },
    //填充左侧列表数据
    bindAritcalData:function(obj,data){
        obj.find(".product_left_inforName span").text(data.Title);
        obj.attr({"ArticleId":data.ArticleId});
    },
    //绑定商品详细信息数据
    bindProDetailData:function(data){
        var oParent=$("#product_inforAboutProduct_title");
        oParent.find("h3").text(data.ProductName);
        if(data.UploadList){
            oParent.find("img").attr({"src":data.UploadList[0].UploadPath});
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            body=$("#product_inforAboutProduct_content"),
            oLeft=body.find(".product_inforAboutProduct_content_left_template_layer"),
            oLeftBtn=oLeft.find(".product_left_oper a"),
            oRight=body.find(".product_inforAboutProduct_content_right_template_layer"),
            oRightBtn=oRight.find(".product_right_oper a"),
            oSubmit=$("#product_inforAboutProduct_oper_add"),
            oClear=$("#product_inforAboutProduct_oper_empty"),
            oSearch=$("#product_inforAboutProduct_content_left_search_btn");

        //左侧按钮事件
        oLeftBtn.live("click",function(){
            _this.left2R(this,oRight);
        });
        //右侧按钮事件
        oRightBtn.live("click",function(){
            _this.right2L(this,oLeft);
        });
        //清空右侧数据
        oClear.live("click",function(){
            _this.clearData();
        });
        //添加右侧数据至数据库
        oSubmit.live("click",function(){
            _this.submitData(oRight);
        });
        //查询数据
        oSearch.live("click",function(){
            _this.oSearchDetail();
        });
    },
    //查询事件
    oSearchDetail:function(){
        this.keyword=$("#product_inforAboutProduct_content_left_search_text").val();
        $("#product_inforAboutProduct_content_left_template_layer").empty();
        this.isGo=false;
        this.getListForProduct();
    },
    left2R:function(obj,layer){
        var oTem=$("#product_inforAboutProduct_content_right_template"),
            oTar=null,
            isGo=true;
        layer.find(".product_inforAboutProduct_content_right_template").each(function(){
            if($(this).attr("articleid")==$(obj).parent().parent().attr("articleid")){
                alert("不能重复移动同一条数据！");
                isGo=false;
                return false;
            }
        });
        if(isGo){
            oTar=oTem.clone(true);
            oTar.removeAttr("id");
            oTar.removeAttr("style");
            oTar.attr({"ArticleId":$(obj).parent().parent().attr("ArticleId")});
            oTar.find(".product_right_inforName span").text($(obj).parent().prev().find("span").text());
            oTar.appendTo(layer);
        }
    },
    right2L:function(obj,layer){
        $(obj).parent().parent().remove();
    },
    //清空右侧数据函数
    clearData:function(){
        var _this=this;
        top.AJAX.AddConsultation({
            data:[{
                ProductId:parseInt(_this.productId)       // 商品id  @param:int
            }],
            callback:function(rs){
               alert("数据清空成功！");
                $("#product_inforAboutProduct_content_right_template_layer").empty();
            }
        });
    },
    //添加右侧数据至数据库
    submitData:function(obj){
        var arr=[];
        var _this=this;
        obj.find(".product_inforAboutProduct_content_right_template").each(function(){
            var c={};
            c.ArticleId=parseInt($(this).attr("articleid"));
            c.ProductId=parseInt(_this.productId);
            arr.push(c);
        });
        var _this=this;
        if(arr.length==0){
            alert("传入数据不能为空!");
        }else{
            top.AJAX.AddConsultation({
                data:arr,
                callback:function(rs){
                    alert("数据添加成功！");
                }
            });
        }
    }
};