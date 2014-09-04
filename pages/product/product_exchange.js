/**
 * Created by hugly on 14-9-2.
 */
titleDetail=[
    {title:"兑换ID",type:"word",width:100,key:"ExchangeID"},
    {title:"商品ID",type:"word",width:100,key:"ProductID"},
    {title:"商品名称",type:"word",width:300,key:"ProductName"},
    {title:"可兑换的商品数量",type:"word",width:100,key:"ExchangeCount"},
    {title:"所需积分",type:"word",width:80,key:"PointValue"},
    {title:"操作",type:"operaType",width:150,key:"",opera:["编辑"],fun:[aa]}
];
data=[];
function aa(obj,data){
    top.AJAX.getProductExchangeDetail({
        data:{
            exchangeID:data.ExchangeID
        },
        callback:function(rs){
            PRODUCTEXCHANGE.addProduct(rs);
        }
    });
}
$(document).ready(function(){
    PRODUCTEXCHANGE.init();
});
PRODUCTEXCHANGE={
    href:"",
    //select菜单
    SelectList:[],
    //初始化
    init:function(){
        if(window.location.href.indexOf("productName")!=-1){
            this.href=decodeURI(window.location.href.substring(window.location.href.indexOf("=")+1));
        }
        $(".search_product_exchange_search_pro").val(this.href);
        this.getExchangeList();
        this.bindEvent();
    },
    //获取列表数据
    getExchangeList:function(){
        var _this=this,
            div=$("#product_exchange_layer");
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:div,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:div,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getProductExchangeList",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"exchangeId",         //翻页需要传递的参数id    @param:str
            searchData:{
                productName:_this.href
            }
        });
    },
    //绑定数据
    IterationData:function(rs){
        var oParent=$("#product_exchange_layer");
        data=data.concat(rs);
        CREATE_LIST.init(oParent);
    },
    //获取兑换商品数据
    getProductList:function(val){
        var _this=this;
        top.AJAX.GetCompanyExchangeableProductList({
                data: {
                    productName:val
                },
                callback: function (rs) {
                    _this.SelectList=_this.exportDataBeSelsect(rs);
                    _this.createExchangeList(val);
                }
            }
        );
    },
    //根据id获取商品
    getProductById:function(id){
        var _this=this;
        top.AJAX.getExchangeProductById({
            data:{
                productId:id
            },
            callback:function(rs){
                var div=$("#ProductID");
                _this.bindDataToPage(rs,div);
            }
        });
    },
    //将输出数据绑定到页面的相应位置
    bindDataToPage:function(data,obj){
        for(var i= 0,j=data.length;i<j;i++){
            var oPtion=$("<option value='"+data[i].Value+"'>"+data[i].Text+"</option>");
            obj.append(oPtion);
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oAdd=$("#add_product_exchange"),
            oSearch=$("#search_product_query");

        //添加可兑换商品
        oAdd.live("click",function(){
            _this.addProduct();
        });
        //查询
        oSearch.live("click",function(){
            _this.searchPro(this);
        });
    },
    //生成兑换商品列表
    createExchangeList:function(val){
        var _this=this,
            div=$("#award_product_layer");

        this.ExchangePro=new CREATE_INPUT({
            data:[
                //select
                {
                    title:"兑换商品",
                    type:"select",
                    id:"ProductID",
                    msg:"",
                    isMust:true,
                    val:_this.SelectList
                },
                //text
                {
                    title:"商品名称",
                    type:"text",
                    id:"productName",
                    msg:"",
                    isMust:true,
                    val:val
                }
            ],
            body:div
        });
        var obj=$('<a href="javascript:;" id="search_Porduct_inAwardSetting">查询</a>');
        obj.click(function(){
            _this.getProductList($(this).prev().find("#productName").val());
            div.html("");
        });
        div.append(obj);

    },
    //添加可兑换商品
    addProduct:function(data){
        var _this=this,
            clone=$("#add_product_exchange_temp"),
            div=clone.clone(true).attr({"id":""}).css({"display":"block"});

        $.openDiv({
            width:650,
            height:220,
            title:"添加可兑换商品",
            div:div
        });
        var oProduct=$("<div id='award_product_layer'></div>");
        div.append(oProduct);

        this.createExchangeList();

        if(data){
            if(data.ProductID){
                this.getProductById(data.ProductID);
            }

            this.Exchange=new CREATE_INPUT({
                data:[
                    //select
                    {
                        title:"可兑换的商品数量",
                        type:"text",
                        id:"ExchangeCount",
                        msg:"",
                        isMust:true,
                        val:data.ExchangeCount
                    },
                    //text
                    {
                        title:"所需积分",
                        type:"text",
                        id:"PointValue",
                        msg:"",
                        isMust:true,
                        val:data.PointValue
                    }
                ],
                body:div
            });
        }else{
            this.Exchange=new CREATE_INPUT({
                data:[
                    //select
                    {
                        title:"可兑换的商品数量",
                        type:"text",
                        id:"ExchangeCount",
                        msg:"",
                        isMust:true,
                        val:""
                    },
                    //text
                    {
                        title:"所需积分",
                        type:"text",
                        id:"PointValue",
                        msg:"",
                        isMust:true,
                        val:""
                    }
                ],
                body:div
            });
        }
        var objSbumit=$('<a href="javascript:;" id="submit_add_subject_list_temp">提交</a>');

        objSbumit.click(function(){
            _this.oSubmit(data);
        });

        div.append(objSbumit);
    },
    //查询
    searchPro:function(obj){
        this.href=$(obj).prev().val();
        window.location.href="product_exchange.html?productName="+this.href;

    },
    //将data输出成select菜单
    exportDataBeSelsect:function(data){
        var arr=[];
        for(var i= 0,j=data.length;i<j;i++){
            var c={};
            c.id=data[i].Value;
            c.val=data[i].Text;
            c.select=data[i].Selected;
            arr.push(c);
        }
        return arr;
    },
    //提交事件
    oSubmit:function(dataDetail){
        var data={},
            data1=this.ExchangePro.getData(),
            data2=this.Exchange.getData(),
            ExchangeCount= 0,
            PointValue= 0,
            ProductID=0;

        ExchangeCount=parseInt(data2.ExchangeCount);
        PointValue=parseInt(data2.PointValue);
        ProductID=parseInt(data1.ProductID);

        data={
            ExchangeCount:ExchangeCount,
            PointValue:PointValue,
            ProductID:ProductID
        };
        if(dataDetail){
            var editData={};
            editData= $.extend(data,{
                ExchangeID:dataDetail.ExchangeID
            });
            top.AJAX.UpdateCompanyProductExchange({
                data:editData,
                callback:function(){
                    alert("修改成功!");
                    window.location.reload();
                }
            });
        }else{
            top.AJAX.AddCompanyProductExchange({
                data:data,
                callback:function(){
                    alert("添加成功!");
                    window.location.reload();
                }
            });

        }


    }
};