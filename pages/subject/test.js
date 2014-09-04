/**
 * Created by hugly on 14-8-15.
 */
titleDetail=[
    {title:"选择",type:"check",width:50,key:""},
    {title:"排序",type:"word",width:50,key:"DisplaySequence"},
    {title:"商品名称",type:"word",width:120,key:"ProductName"},
    {title:"商品图片",type:"img",width:130,key:"UploadList"},
    {title:"商品编码",type:"word",width:60,key:"ProductNewCode"},
    {title:"市场价",type:"word",width:60,key:"MarketPrice"},
    {title:"商品类型",type:"word",width:70,key:"ProductType"},
    {title:"商品比价",type:"static",width:60,key:"商品比价"},
    {title:"关联咨询",type:"static",width:60,key:"关联咨询"},
    {title:"显示状态",type:"dis",width:50,key:"IsShow"},
    {title:"添加时间",type:"time",width:100,key:"AddedDate"},
    {title:"操作",type:"opera",width:118,key:"id"}
];
data=[
];
//编辑
function aa(obj,data){
    console.log(obj);
    console.log(data);
}

//删除
function bb(obj,data){

    console.log(data);
}

//显示/不显示
function cc(obj,data){

    console.log(data);
}
$(document).ready(function(){
    test.init();
});
test={
    //初始化
    init:function(){
        this.getData();
        SUBJECT_LIST.init();
    },
    //获取数据
    getData:function(){
        var _this=this;
        //获取商品列表
        $.scrollLoadInterval({
            runIn:this,                               //加个回调执行对象
            mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
            buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName:"getProductList",         //@param:str       调用的api接口名
            bindDataFn:_this.bindData,                  //@param:function 数据绑定函数
            scrollForKey:"ProductId",                 //@param:str       滚动加载需要的key
            searchData:{
                productName:""                         //@param:str        //查询输入的文字
            }
        });

    },
    //数据迭代
    bindData:function(rs){
        data=data.concat(rs);
        SUBJECT_LIST.createListData(titleDetail,data);

    },
    //事件绑定
    bindEvent:function(){
        var oPenDiv=$("#open");
        oPenDiv.live("click",function(){
            $.openDiv({
                width:600,
                height:360,
                title:"订单详情",
                div:div
            })
        });
    }
};


















