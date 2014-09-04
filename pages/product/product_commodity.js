/**
 * Created by hugly on 14-7-11.
 */
$(document).ready(function(){
    product_commodity.init();
});
product_commodity={
    //监听用户是否进行了比价商家里面的操作
    isChange:false,
    //将数据缓存起来
    cacheData:null,
    //比价商家的数量
    contrastNum:0,
    //搜索关键字
    rehref:null,
    //修改比价的商品id
    productId:0,
    //初始化
    init:function(){
        if(window.location.href.indexOf("searchKey")!=-1){
            this.rehref=decodeURI(window.location.href.substring(window.location.href.indexOf("=")+1));
        }
        this.initValue();
        this.getData();
        this.bingEvent();

    },
    //初始化搜索框的值
    initValue:function(){
        $("#search_product_query").prev().val(this.rehref);
    },
    //获取数据
    getData:function(){
        var _this=this;
        if(this.rehref==null){
            this.rehref="";
        }
        //获取商品列表
        $.scrollLoadInterval({
            runIn:this,                               //加个回调执行对象
            mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
            buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName:"getProductList",         //@param:str       调用的api接口名
            bindDataFn:_this.bindData,                  //@param:function 数据绑定函数
            scrollForKey:"ProductId",                 //@param:str       滚动加载需要的key
            searchData:{
                productName:_this.rehref                         //@param:str        //查询输入的文字
            }
        });
    },
    //获取商品比价数据
    getContrastData:function(obj){
        var _this=this;
        //获取商品详细信息
        top.AJAX.getProductInfo({
            data:{
                productId:_this.productId       //商品id  @param:int
            },
            callback:function(rs){
                _this.fillDataInContrast(rs);
            }
        });
    },
    //绑定商品比价数据
    fillDataInContrast:function(data){
        var oTem=$(".add_product_addcommodity_temeplete").eq(1);
        for(var i= 0,l=data.PriceSourcesList.length;i<l;i++){
            this.createContrastDom(data.PriceSourcesList[i],oTem);
        }
    },
    //创建商家比价的文档结构
    createContrastDom:function(data,oTem){
        var oTar=oTem.clone(true);
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillContrastData(oTar,data);
        //插入到相应位置
        oTar.insertAfter(oTem);
    },
    //填充商家比价的数据
    fillContrastData:function(obj,data){
        var show=data.IsShow?"显示":"不显示";
        obj.find(".add_product_addcommodity_goods_price input").val(data.SourcesOfPrice);
        obj.find(".add_product_addcommodity_goods_link input").val(data.PriceSourcesUrl);
        obj.find(".add_product_addcommodity_goods_sort input").val(data.Sort);
        obj.find(".add_product_addcommodity_goods_s").find("option").each(function(){
            if($(this).attr("value")==data.BusinessesId){
                $(this).attr({"selected":"true"});
            }
        });
        obj.attr({"PriceSourcesId":data.PriceSourcesId});
        obj.attr({"dis":data.IsShow});
        obj.find(".add_product_addcommodity_goods_dis a").text(show);
    },
    //绑定数据
    bindData:function(data){
        var oParent=$("#product_commodity_title"),
            oTem=$("#product_commodity_template");
        for(var i=0;i<data.length;i++){
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
        var type=null;
        if(data.ProductType==0){
            type="普通商品";
        }else{
            type="优惠券商品";
        }
        var isShow=data.IsShow?"显示":"不显示";
        obj.find(".product_commodity_sort span").text(data.DisplaySequence);
        obj.find(".product_commodity_name a").text(data.ProductName);
        if(data.UploadList!=null){
            obj.find(".product_commodity_logo img").attr({"src":data.UploadList[0].UploadPath});
        }
        obj.find(".product_commodity_code span").text(data.ProductNewCode);
        obj.find(".product_commodity_price span").text(data.MarketPrice);
        obj.find(".porduct_commodity_protype span").text(type);
        obj.find(".product_commodity_dis a").text(isShow);
        obj.find(".product_commodity_addData span").text($.stamp2time(data.AddedDate).substr(0,$.stamp2time(data.AddedDate).indexOf(" ")));
        obj.attr({"ProductId":data.ProductId});
        obj.attr({"dis":data.IsShow});
    },
    //绑定事件
    bingEvent:function(){
        var _this=this,
            oAdd=$("#add_product_commodity"),
            oParent=$("#product_commodity_title"),
            oAddParent=$("#add_product_addcommodity_goodslist"),
            oEdit=oParent.find(".product_commodity_detail_edit"),
            oDel=oParent.find(".product_commodity_detail_del"),
            //查询
            oSearch=$("#search_product_query"),
            //修改比价
            oModify=oParent.find(".product_commodity_addContrast a"),
            oDelZoom=$("#add_product_addcommodity_goods_del"),
            oSure=$("#add_product_addcommodity_goods_list_add"),
            //修改商品显示状态
            oDis=oParent.find(".product_commodity_dis a"),
            //编辑当前行
            oEditContrast=oAddParent.find(".add_product_addcommodity_goods_edit"),
            // 确定修改
            oSureContrast=oAddParent.find(".add_product_addcommodity_goods_ok"),
            // 删除当前行
            oDelContrast=oAddParent.find(".add_product_addcommodity_goods_del"),
            // 新建列表行
            oNewContrast=$("#add_product_addcommodity_goods_build"),
            // 提交当所有前数据
            oSubmit=$("#add_product_addcommodity_goods_submit"),
            //商品比价的显示隐藏
            oDisContrast=$(".add_product_addcommodity_goods_dis a"),
            //商品的相关资讯
            oInformarion=oParent.find(".product_commodity_consu a"),
            aInput=oAddParent.find("input");

        //添加新商品
        oAdd.click(function(){
            _this.addcommodity();
        });
        //编辑商品
        oEdit.click(function(){
            _this.editDetail(this);
        });
        //删除商品
        oDel.click(function(){
            _this.delDetail(this);
        });
        //搜索
        oSearch.click(function(){
            _this.screenDetail(this);
        });
        //修改比价
        oModify.click(function(){
            _this.modifyDetail(this);
        });
        //关闭弹出层
        oDelZoom.click(function(){
            _this.closeZoom(this);
        });
        //确定修改比价
        oSure.click(function(){
            _this.oSureDetail(this);
        });
        //修改商品显示状态
        oDis.click(function(){
            _this.editDis(this);
        });
        //编辑当前行
        oEditContrast.click(function(){
            _this.EditContrast(this);
        });
        // 确定修改
        oSureContrast.click(function(){
            _this.SureContrast(this);
        });
        // 删除当前行
        oDelContrast.click(function(){
            _this.DelContrast(this);
        });
        // 新建列表行
        oNewContrast.click(function(){
            _this.NewContrast(this);
        });
        // 提交当所有前数据
        oSubmit.click(function(){
            _this.Submit(this);
        });
        //商品比价的显示隐藏
        oDisContrast.click(function(){
            _this.contrastDis(this);
        });
        //相关资讯
        oInformarion.click(function(){
            _this.operInformation(this);
        });
        //所有输入框监听事件
        aInput.blur(function(){
            _this.isChange=true;
        });
    },
    //商品比价的显示隐藏
    contrastDis:function(obj){
        if($(obj).parent().parent().attr("PriceSourcesId")){
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

            //商品比价是否显示
            top.AJAX.editContrastComment({
                data:{
                    priceSourceId:$(obj).parent().parent().attr("PriceSourcesId"),            //@param:int 评论id
                    isshow:dis       //@param:int 显示状态  1:显示 0:不显示
                },
                callback:function(rs){
                    var show=dis?"显示":"不显示";
                    $(obj).text(show);
                    dis=$(obj).parent().parent().attr({"dis":dis});
                }
            });
        }else{
            alert("必须在提交当前这条数据后才能对比价商家是否显示做相关操作!");
        }
    },
    //编辑当前行
    EditContrast:function(obj){
        $(obj).parent().parent().find("input").removeAttr("readonly");
        $(obj).parent().parent().find("input").css({"border":"1px solid #333"});
    },
    // 确定修改
    SureContrast:function(obj){
        $(obj).parent().parent().find("input").attr("readonly");
        $(obj).parent().parent().find("input").css({"border":"1px solid #fff"});
    },
    // 删除当前行
    DelContrast:function(obj){
        this.isChange=true;
        $(obj).parent().parent().remove();
    },
    // 新建列表行
    NewContrast:function(obj){
        this.isChange=true;
        var total=$(obj).parent().find(".add_product_addcommodity_temeplete").length;
        if(total>this.contrastNum){
            alert("不能创建更多的比价，因为你的比价商家数量小于你要创建的比价数量！");
        }else{
            var oTem=$(".add_product_addcommodity_temeplete").eq(1);
            var oTar=oTem.clone(true);
            oTar.removeAttr("id");
            oTar.removeAttr("style");
            oTar.find("input").removeAttr("readonly");
            oTar.find("input").css({"border":"1px solid #333"});
            oTar.find(".add_product_addcommodity_goods_dis a").text("显示")
            //oTar.attr({"PriceSourcesId":0});
            //oTar.attr({"dis":true});
            oTar.insertAfter(oTem);
        }
    },
    // 提交当所有前数据
    Submit:function(obj){
        var contarstname=[],
            contarstprice=[],
            contarstlink=[],
            contarstsort=[],
            _this=this,
            arr=[],
            isGo=true;
        $(obj).parent().find(".add_product_addcommodity_goods_s").each(function(){
            contarstname.push($(this).val());
        });
        $(obj).parent().find(".add_product_addcommodity_goods_price input").each(function(){
            contarstprice.push($(this).val());
        });
        $(obj).parent().find(".add_product_addcommodity_goods_link input").each(function(){
            contarstlink.push($(this).val());
        });
        $(obj).parent().find(".add_product_addcommodity_goods_sort input").each(function(){
            contarstsort.push($(this).val());
        });
        contarstname.shift();
        contarstprice.shift();
        contarstlink.shift();
        contarstsort.shift();
        for(var i= 0,l=contarstlink.length;i<l;i++){
            if(contarstname[i]=="<--请选择-->"){
                contarstname[i]="";
            }
            var c={};
            c.CouponProductId=parseInt(_this.productId);
            c.BusinessesId=contarstname[i];
            c.Sort=contarstsort[i];
            c.SourcesOfPrice=contarstprice[i];
            c.PriceSourcesUrl=contarstlink[i];
            arr.push(c);

            if(contarstname[i]=="" || contarstprice[i]=="" || contarstlink[i]==""){
                isGo=false;
            }

        }
//        if(arr.length==0){
//            alert("请点击新建行来创建你的比价！");
//        }else{
            //修改商品比价
        if(arr.length==0){
            arr=[{"CouponProductId":this.productId}];
            isGo=false;
        }
        if(isGo){
            top.AJAX.editProductParity({
                data:arr,
                callback:function(rs){
                    alert("比价数据提交成功！");
                    window.location.reload();
                }
            });
        }else{
            alert("请创建比价或者按规则填入相关字段!");
        }
    },
    //获取比价商家列表
    getContarstList:function(obj){
        var _this=this;
        //获取比价商品信息列表
        top.AJAX.getCouponBusinessesList({
            data:{
                queryKey:""     //@param:str   查询条件
            },
            callback:function(rs){
                _this.bindContrastData(obj,rs);
                _this.getContrastData();
            }
        });
    },
    //绑定数据到比价商家
    bindContrastData:function(obj,data){
        var oParent=obj.find(".add_product_addcommodity_goods_s");
        this.contrastNum=data.length;
        for(var i= 0,l=data.length;i<l;i++){
            $("<option value="+data[i].BusinessesId+">"+data[i].BusinessesName+"</option>").appendTo(oParent);
        }
    },
    //确定修改比价
    oSureDetail:function(obj){
        var _this=this;
        //修改商品比价
        top.AJAX.editProductParity({
            data:{
                CouponProductId:_this.productId,         //商品id   @param:int
                BusinessesId:$("#add_product_addcommodity_goods_store").attr("businessesid"),            //比价来源商家id(eg:淘宝)  @param:int
                Sort:$("#add_product_addcommodity_goods_sort").val(),                    //排序    @param:int
                SourcesOfPrice:$("#add_product_addcommodity_goods_price").val(),          //价格    @param:float   eg:12.00
                PriceSourcesUrl:$("#add_product_addcommodity_goods_link").val()          //来源地址  @param:str
            },
            callback:function(rs){
                alert("修改成功！");
            }
        });
    },
    //关闭弹出层
    closeZoom:function(obj){
        if(this.isChange){
            if(confirm("你有未保存的比价商家信息，是否要保存相关数据？")){
                this.Submit($("#add_product_addcommodity_goods_submit"));
            }else{
                $("#add_product_contrast_con").css({"display":"none"});
                $(obj).parent().parent().remove();
            }
        }else{
            $("#add_product_contrast_con").css({"display":"none"});
            $(obj).parent().parent().remove();
        }
    },
    //修改比价
    modifyDetail:function(obj){
        $("#add_product_contrast_con").css({"display":"block"});
        //$("#add_product_addcommodity_goodslist").css({"display":"block"});
        var oTem=$("#add_product_addcommodity_goodslist");
        var oTar=oTem.clone(true);
        oTar.removeAttr("id");
        oTar.removeAttr("style");
        oTar.appendTo("body");
        this.getContarstList(oTar);
        this.productId=$(obj).parent().parent().attr("productid");
    },
    //搜索筛选列表
    screenDetail:function(obj){
        this.rehref=$(obj).prev().val();
        window.location.href="product_commodity.html?searchKey="+this.rehref;
    },
    //添加新商品函数
    addcommodity:function(){
        top.O2O.openNewWindow({
            title:"添加新商品",        //@param,  str
            url:"pages/product/product_addcommodity.html",          //@param,  str
            width:850,        //@param,  int
            height:600        //@param,  int
        },"proAdd");
    },
    //编辑商品
    editDetail:function(obj){
        top.O2O.openNewWindow({
            title:"编辑商品",        //@param,  str
            url:"pages/product/product_addcommodity.html?ProductId="+$(obj).parent().parent().attr("ProductId"),          //@param,  str
            width:850,        //@param,  int
            height:600        //@param,  int
        },"proDetail");
    },
    //相关资讯
    operInformation:function(obj){
        top.O2O.openNewWindow({
            title:"商品相关资讯",        //@param,  str
            url:"pages/product/product_inforAboutProduct.html?ProductId="+$(obj).parent().parent().attr("ProductId"),          //@param,  str
            width:700,        //@param,  int
            height:600        //@param,  int
        });
    },
    //删除商品
    delDetail:function(obj){
        //删除商品
        if(confirm("确定删除吗？")){
            top.AJAX.delProduct({
                data:{
                    productId:$(obj).parent().parent().attr("productid")       //商品id  @param:int
                },
                callback:function(rs){
                        $(obj).parent().parent().remove();
                    }
            });
        }
    },
    //修改商品显示状态
    editDis:function(obj){
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
        //修改商品显示状态
        top.AJAX.isUseProduct({
            data:{
                productId:$(obj).parent().parent().attr("productid"),       //商品id  @param:int
                isshow:dis           //是否显示  @param:boolean   true/false
            },
            callback:function(rs){
                var show=dis?"显示":"不显示";
                $(obj).text(show);
                dis=$(obj).parent().parent().attr({"dis":dis});
            }
        });
    }
};